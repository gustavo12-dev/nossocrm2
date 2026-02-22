/**
 * LangGraph-style state machine for the multi-agent CRM orchestrator.
 *
 * Graph nodes:
 *   intentClassifier → skillDispatcher → [frontendAgent | backendAgent]
 *                    ↘ dnaExtractor (runs in background, no-await)
 *                    ↘ handoffController (checks/updates mode)
 *
 * State is persisted in Upstash Redis between turns.
 */

import { redis, agentStateKey, TTL } from '@/lib/upstash';
import {
    AgentState,
    OrchestratorStep,
    IntentTag,
    createAgentState,
    mergeAgentState,
} from './agentState';

// ─────────────────────────────────────────────────────────────────────────────
// State persistence helpers
// ─────────────────────────────────────────────────────────────────────────────

export async function loadAgentState(
    orgId: string,
    conversationId: string
): Promise<AgentState | null> {
    try {
        return await redis.get<AgentState>(agentStateKey(orgId, conversationId));
    } catch (err) {
        console.warn('[Orchestrator] Failed to load agent state from Upstash:', err);
        return null;
    }
}

export async function saveAgentState(state: AgentState): Promise<void> {
    try {
        await redis.set(agentStateKey(state.orgId, state.conversationId), state, {
            ex: TTL.agentState,
        });
    } catch (err) {
        console.error('[Orchestrator] Failed to save agent state to Upstash:', err);
    }
}

export async function getOrCreateAgentState(params: {
    orgId: string;
    conversationId: string;
    userId: string;
    boardId?: string;
    dealId?: string;
    contactId?: string;
}): Promise<AgentState> {
    const existing = await loadAgentState(params.orgId, params.conversationId);
    if (existing) return existing;

    const fresh = createAgentState(params);
    await saveAgentState(fresh);
    return fresh;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Intent Classifier
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_PATTERNS: Record<IntentTag, RegExp[]> = {
    SCHEDULING: [/agend[ae]|reunião|encontro|call|marcar|hora\b|horário/i],
    GENERATE_PROPOSAL: [/proposta|orçamento|gerar.*proposta|criar.*proposta/i],
    CLASSIFY_INBOX: [/classific|categoriz|inbox|caixa de entrada|etiquet/i],
    DEAL_ACTION: [/mover|criar deal|mover deal|marcar.*ganho|marcar.*perdido|atualizar deal/i],
    CONTACT_RESEARCH: [/pesquisar contato|linkedin|enriquecer|empresa.*lead|site.*empresa/i],
    PIPELINE_ANALYSIS: [/pipeline|funil|métricas|análise|win rate|kpi|convertidos/i],
    GENERAL_QUERY: [/buscar|listar|mostrar|quais|quantos|deals?|contatos?/i],
    UNKNOWN: [],
};

export function classifyIntent(userMessage: string): IntentTag {
    for (const [tag, patterns] of Object.entries(INTENT_PATTERNS) as [IntentTag, RegExp[]][]) {
        if (tag === 'UNKNOWN') continue;
        if (patterns.some((p) => p.test(userMessage))) return tag;
    }
    return 'UNKNOWN';
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Skill Dispatcher
// Maps an intent to the skill name that will be invoked via MCP
// ─────────────────────────────────────────────────────────────────────────────

export const INTENT_TO_SKILL: Record<IntentTag, string> = {
    SCHEDULING: 'skill-scheduling',
    GENERATE_PROPOSAL: 'skill-generate-proposal',
    CLASSIFY_INBOX: 'skill-classify-inbox',
    DEAL_ACTION: 'skill-deal-actions',
    CONTACT_RESEARCH: 'skill-contact-research',
    PIPELINE_ANALYSIS: 'skill-deal-actions',
    GENERAL_QUERY: 'skill-deal-actions',
    UNKNOWN: 'skill-deal-actions',
};

export function resolveSkill(intent: IntentTag): string {
    return INTENT_TO_SKILL[intent];
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Handoff Controller
// ─────────────────────────────────────────────────────────────────────────────

import { handoffModeKey } from '@/lib/upstash';
import { HandoffMode } from './agentState';

export async function getHandoffMode(
    orgId: string,
    conversationId: string
): Promise<HandoffMode> {
    try {
        const mode = await redis.get<HandoffMode>(handoffModeKey(orgId, conversationId));
        return mode ?? 'AI';
    } catch {
        return 'AI';
    }
}

export async function setHandoffMode(
    orgId: string,
    conversationId: string,
    mode: HandoffMode
): Promise<void> {
    await redis.set(handoffModeKey(orgId, conversationId), mode, { ex: TTL.handoffMode });
}

// ─────────────────────────────────────────────────────────────────────────────
// Node: Observability Step Emitter
// ─────────────────────────────────────────────────────────────────────────────

import { observabilityLogKey } from '@/lib/upstash';
import { randomUUID } from 'crypto';

export async function emitOrchestratorStep(
    state: AgentState,
    step: Omit<OrchestratorStep, 'stepId' | 'timestamp'>
): Promise<OrchestratorStep> {
    const fullStep: OrchestratorStep = {
        ...step,
        stepId: randomUUID(),
        timestamp: new Date().toISOString(),
    };

    const today = new Date().toISOString().slice(0, 10);
    const logKey = observabilityLogKey(state.orgId, today);

    try {
        // Prepend to list (most recent first)
        await redis.lpush(logKey, JSON.stringify(fullStep));
        // Keep list capped at 500 entries per day per org - done via TTL
        await redis.expire(logKey, TTL.observability);
    } catch (err) {
        console.warn('[Orchestrator] Failed to emit observability step:', err);
    }

    return fullStep;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main: Run one orchestrator turn
// ─────────────────────────────────────────────────────────────────────────────

export interface OrchestratorTurnInput {
    orgId: string;
    conversationId: string;
    userId: string;
    userMessage: string;
    boardId?: string;
    dealId?: string;
    contactId?: string;
}

export interface OrchestratorTurnOutput {
    state: AgentState;
    intent: IntentTag;
    skill: string;
    shouldAIRespond: boolean;
    handoffMode: HandoffMode;
}

/**
 * processOrchestratorTurn
 *
 * Runs one LangGraph-like turn:
 * 1. Load (or create) AgentState from Upstash
 * 2. Check handoff mode — if HUMAN, skip AI processing
 * 3. Classify intent from userMessage
 * 4. Resolve skill to invoke
 * 5. Emit observability step
 * 6. Persist updated state
 * 7. Return enriched context to the caller (FrontendAgent)
 */
export async function processOrchestratorTurn(
    input: OrchestratorTurnInput
): Promise<OrchestratorTurnOutput> {
    const t0 = Date.now();

    // 1. Load or create state
    let state = await getOrCreateAgentState({
        orgId: input.orgId,
        conversationId: input.conversationId,
        userId: input.userId,
        boardId: input.boardId,
        dealId: input.dealId,
        contactId: input.contactId,
    });

    // 2. Check handoff mode
    const handoffMode = await getHandoffMode(input.orgId, input.conversationId);
    if (handoffMode === 'HUMAN') {
        console.log('[Orchestrator] HUMAN mode active — skipping AI processing.');
        return { state, intent: 'UNKNOWN', skill: '', shouldAIRespond: false, handoffMode };
    }

    // 3. Classify intent
    const intent = classifyIntent(input.userMessage);

    // 4. Resolve skill
    const skill = resolveSkill(intent);

    // 5. Update state
    state = mergeAgentState(state, {
        currentIntent: intent,
        currentSkill: skill,
        handoffMode,
        boardId: input.boardId ?? state.boardId,
        dealId: input.dealId ?? state.dealId,
        contactId: input.contactId ?? state.contactId,
    });

    // 6. Emit observability step
    const step = await emitOrchestratorStep(state, {
        agent: 'FRONTEND',
        intent,
        skillInvoked: skill,
        durationMs: Date.now() - t0,
        reasoning: `Intent classified as ${intent} from message: "${input.userMessage.slice(0, 80)}"`,
    });

    state = mergeAgentState(state, {
        recentSteps: [...state.recentSteps.slice(-9), step],
    });

    // 7. Persist
    await saveAgentState(state);

    console.log('[Orchestrator] Turn complete:', { intent, skill, handoffMode, durationMs: Date.now() - t0 });

    return { state, intent, skill, shouldAIRespond: true, handoffMode };
}
