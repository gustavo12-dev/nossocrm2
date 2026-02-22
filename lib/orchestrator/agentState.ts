/**
 * AgentState — canonical state object for the multi-agent orchestrator.
 * Persisted in Upstash Redis (TTL: 24h per conversation).
 */

export type HandoffMode = 'AI' | 'HYBRID' | 'HUMAN';

export type AgentRole = 'FRONTEND' | 'BACKEND' | 'DNA' | 'RESEARCHER' | 'FOLLOWUP';

export type IntentTag =
    | 'SCHEDULING'
    | 'GENERATE_PROPOSAL'
    | 'CLASSIFY_INBOX'
    | 'DEAL_ACTION'
    | 'CONTACT_RESEARCH'
    | 'PIPELINE_ANALYSIS'
    | 'GENERAL_QUERY'
    | 'UNKNOWN';

/** Pain/objection signal extracted from conversation */
export interface DnaSignal {
    type: 'PAIN' | 'OBJECTION' | 'TICKET' | 'REVENUE' | 'DECISION_MAKER';
    value: string;
    confidence: number; // 0.0–1.0
    extractedAt: string; // ISO timestamp
}

/** Lead DNA — extracted in background, persisted to Supabase */
export interface LeadDna {
    pains: string[];
    objections: string[];
    avgTicket?: number;
    revenue?: number;
    decisionMaker?: string;
    signals: DnaSignal[];
    lastUpdated: string; // ISO timestamp
}

/** A single step recorded by the orchestrator for observability */
export interface OrchestratorStep {
    stepId: string;
    agent: AgentRole;
    intent?: IntentTag;
    skillInvoked?: string;
    toolsUsed?: string[];
    durationMs?: number;
    supabaseMutations?: string[];
    reasoning?: string;
    timestamp: string; // ISO
}

/** Full agent conversation state */
export interface AgentState {
    conversationId: string;
    orgId: string;
    userId: string;

    // Handoff state
    handoffMode: HandoffMode;
    handoffChangedAt?: string;
    lastHumanSendAt?: string;

    // Current turn context
    currentIntent?: IntentTag;
    currentSkill?: string;
    boardId?: string;
    dealId?: string;
    contactId?: string;

    // Lead DNA (updated in background)
    leadDna: LeadDna;

    // Observability — last N steps kept in memory (full log in Upstash list)
    recentSteps: OrchestratorStep[];

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

/** Factory: create a fresh AgentState */
export function createAgentState(params: {
    conversationId: string;
    orgId: string;
    userId: string;
    boardId?: string;
    dealId?: string;
    contactId?: string;
}): AgentState {
    const now = new Date().toISOString();
    return {
        ...params,
        handoffMode: 'AI',
        leadDna: {
            pains: [],
            objections: [],
            signals: [],
            lastUpdated: now,
        },
        recentSteps: [],
        createdAt: now,
        updatedAt: now,
    };
}

/** Merge a partial state update, always bumping updatedAt */
export function mergeAgentState(
    current: AgentState,
    patch: Partial<Omit<AgentState, 'conversationId' | 'orgId' | 'createdAt'>>
): AgentState {
    return {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
    };
}
