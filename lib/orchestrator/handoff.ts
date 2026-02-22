/**
 * Triple-Handoff state machine for the CRM inbox.
 *
 * Modes:
 *   AI     — AI agent handles all messages automatically
 *   HYBRID — AI still responds but rep can see and intervene
 *   HUMAN  — AI is paused; rep handles all messages manually
 *
 * State is persisted in Upstash Redis, scoped per conversation.
 * The handoff to HUMAN is triggered automatically when a rep sends a manual message.
 */

import { redis, handoffModeKey, TTL } from '@/lib/upstash';
import type { HandoffMode } from '@/lib/orchestrator/agentState';

export type { HandoffMode };

export interface HandoffTransitionResult {
    previousMode: HandoffMode;
    newMode: HandoffMode;
    changed: boolean;
    timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Read / Write
// ─────────────────────────────────────────────────────────────────────────────

export async function getConversationHandoffMode(
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

export async function setConversationHandoffMode(
    orgId: string,
    conversationId: string,
    mode: HandoffMode
): Promise<HandoffTransitionResult> {
    const previous = await getConversationHandoffMode(orgId, conversationId);
    await redis.set(handoffModeKey(orgId, conversationId), mode, {
        ex: TTL.handoffMode,
    });
    const timestamp = new Date().toISOString();
    console.log(`[Handoff] ${previous} → ${mode} for conv ${conversationId}`);
    return { previousMode: previous, newMode: mode, changed: previous !== mode, timestamp };
}

// ─────────────────────────────────────────────────────────────────────────────
// Transition helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Called when a sales rep manually sends a message in the inbox.
 * Automatically transitions AI → HUMAN to pause AI processing.
 */
export async function onHumanSend(
    orgId: string,
    conversationId: string
): Promise<HandoffTransitionResult> {
    return setConversationHandoffMode(orgId, conversationId, 'HUMAN');
}

/**
 * Called when a rep re-enables the AI mode from the inbox toggle.
 */
export async function onReenableAI(
    orgId: string,
    conversationId: string
): Promise<HandoffTransitionResult> {
    return setConversationHandoffMode(orgId, conversationId, 'AI');
}

/**
 * Set to HYBRID mode — AI responds but rep is monitoring.
 */
export async function onEnableHybrid(
    orgId: string,
    conversationId: string
): Promise<HandoffTransitionResult> {
    return setConversationHandoffMode(orgId, conversationId, 'HYBRID');
}

// ─────────────────────────────────────────────────────────────────────────────
// Guard: check if AI should respond
// ─────────────────────────────────────────────────────────────────────────────

export async function shouldAIRespond(
    orgId: string,
    conversationId: string
): Promise<{ allowed: boolean; mode: HandoffMode }> {
    const mode = await getConversationHandoffMode(orgId, conversationId);
    return { allowed: mode !== 'HUMAN', mode };
}

// ─────────────────────────────────────────────────────────────────────────────
// Allowed transitions matrix
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_TRANSITIONS: Record<HandoffMode, HandoffMode[]> = {
    AI: ['HYBRID', 'HUMAN'],
    HYBRID: ['AI', 'HUMAN'],
    HUMAN: ['AI', 'HYBRID'],
};

export function isValidTransition(from: HandoffMode, to: HandoffMode): boolean {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
