/**
 * Namespaced Redis key helpers for the multi-agent CRM system.
 * All keys are scoped by orgId to prevent cross-tenant data leaks.
 */

/** State of an ongoing agent conversation */
export const agentStateKey = (orgId: string, conversationId: string) =>
    `agentState:${orgId}:${conversationId}` as const;

/** Lead DNA metadata for a contact */
export const leadDnaKey = (orgId: string, contactId: string) =>
    `leadDna:${orgId}:${contactId}` as const;

/** Current handoff mode for a conversation (AI | HYBRID | HUMAN) */
export const handoffModeKey = (orgId: string, conversationId: string) =>
    `handoffMode:${orgId}:${conversationId}` as const;

/** Observability step log list for a given date (YYYY-MM-DD) */
export const observabilityLogKey = (orgId: string, date: string) =>
    `obs:${orgId}:${date}` as const;

/** Researcher enrichment cache for a contact */
export const contactEnrichmentKey = (orgId: string, contactId: string) =>
    `enrichment:${orgId}:${contactId}` as const;

/** Follow-up schedule for a conversation */
export const followUpKey = (orgId: string, conversationId: string) =>
    `followup:${orgId}:${conversationId}` as const;

/**
 * TTL constants (seconds)
 */
export const TTL = {
    agentState: 60 * 60 * 24,       // 24h
    leadDna: 60 * 60 * 24 * 30,     // 30 days
    handoffMode: 60 * 60 * 24 * 7,  // 7 days
    observability: 60 * 60 * 24 * 7,// 7 days
    enrichment: 60 * 60 * 24 * 14,  // 14 days
    followUp: 60 * 60 * 24 * 3,     // 3 days
} as const;
