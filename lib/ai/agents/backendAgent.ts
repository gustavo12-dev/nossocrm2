/**
 * BackendAgent — silent CRM mutation agent.
 *
 * Responsibilities:
 * - Executes all Supabase mutations (move, create, update, mark won/lost, assign, task)
 * - NEVER interacts with the user directly
 * - Triggered programmatically by the orchestrator after frontend intent + user approval
 * - Uses only MUTATION tools
 *
 * This agent has NO conversational instructions — it is a pure executor.
 */

import { generateText, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { CRMCallOptions } from '@/types/ai';
import { createCRMTools } from '../tools';
import { AI_DEFAULT_MODELS, AI_DEFAULT_PROVIDER } from '../defaults';
import { emitOrchestratorStep } from '@/lib/orchestrator/graph';
import type { AgentState } from '@/lib/orchestrator/agentState';

type AIProvider = 'google' | 'openai' | 'anthropic';

/** Mutation tools available only to the BackendAgent */
const BACKEND_TOOL_NAMES = [
    'moveDeal',
    'createDeal',
    'updateDeal',
    'markDealAsWon',
    'markDealAsLost',
    'assignDeal',
    'createTask',
] as const;

const BASE_INSTRUCTIONS_BACKEND = `Você é um agente executor silencioso de CRM.

PAPEL: Executar ações de banco de dados com precisão. NENHUMA resposta ao usuário.
- Execute a ação solicitada usando as ferramentas disponíveis
- Retorne apenas um JSON confirmando sucesso ou erro
- NÃO gere texto conversacional
- NÃO peça confirmações adicionais

FERRAMENTAS (mutação apenas):
moveDeal, createDeal, updateDeal, markDealAsWon, markDealAsLost, assignDeal, createTask`;

export interface BackendAgentInput {
    action: string;     // e.g. "move deal X to stage Y"
    context: CRMCallOptions;
    userId: string;
    orchestratorState: AgentState;
    apiKey: string;
    modelId?: string;
    provider?: AIProvider;
}

export async function runBackendAgent(input: BackendAgentInput): Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
}> {
    const {
        action,
        context,
        userId,
        orchestratorState,
        apiKey,
        modelId = AI_DEFAULT_MODELS.google,
        provider = AI_DEFAULT_PROVIDER,
    } = input;

    const t0 = Date.now();
    console.log('[BackendAgent] 🔧 Executing action:', action);

    const model = buildModel(provider, apiKey, modelId);

    const allTools = createCRMTools(context, userId);
    const backendTools = Object.fromEntries(
        BACKEND_TOOL_NAMES
            .filter((name) => name in allTools)
            .map((name) => [name, (allTools as Record<string, unknown>)[name]])
    ) as Record<string, unknown>;

    try {
        // Use generateText with tool loop instead of ToolLoopAgent for better type compatibility
        const response = await generateText({
            model,
            system: BASE_INSTRUCTIONS_BACKEND,
            prompt: action,
            tools: backendTools as Parameters<typeof generateText>[0]['tools'],
            stopWhen: stepCountIs(4),
        });

        await emitOrchestratorStep(orchestratorState, {
            agent: 'BACKEND',
            intent: orchestratorState.currentIntent,
            skillInvoked: orchestratorState.currentSkill,
            toolsUsed: [...BACKEND_TOOL_NAMES],
            durationMs: Date.now() - t0,
            supabaseMutations: [action],
            reasoning: `BackendAgent executed: ${action}`,
        });

        console.log('[BackendAgent] ✅ Action complete:', { durationMs: Date.now() - t0 });
        return { success: true, result: response.text };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[BackendAgent] ❌ Action failed:', message);
        return { success: false, error: message };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildModel(provider: AIProvider, apiKey: string, modelId: string) {
    switch (provider) {
        case 'openai': {
            const openai = createOpenAI({ apiKey });
            return openai(modelId);
        }
        case 'anthropic': {
            const anthropic = createAnthropic({ apiKey });
            return anthropic(modelId);
        }
        default: {
            const google = createGoogleGenerativeAI({ apiKey });
            return google(modelId);
        }
    }
}
