/**
 * Skill: Deal Actions
 * Thin wrapper exposing mutation tools for the BackendAgent.
 * Used when the orchestrator resolves DEAL_ACTION, PIPELINE_ANALYSIS, or GENERAL_QUERY intent.
 */

export { createCRMTools } from '@/lib/ai/tools';

export const dealActionsSkill = {
    skillId: 'skill-deal-actions',
    intentTags: ['DEAL_ACTION', 'PIPELINE_ANALYSIS', 'GENERAL_QUERY', 'UNKNOWN'],
    description: 'CRM deal operations: move, create, update, mark won/lost, assign, create task',
};
