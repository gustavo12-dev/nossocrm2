/**
 * FrontendAgent — conversational agent.
 * 
 * Responsibilities:
 * - Empathy, conversation flow, and user-facing responses
 * - Intent recognition (via orchestrator)
 * - Only uses READ-ONLY tools (no DB mutations)
 * - Delegates mutations to BackendAgent via orchestrator BackendEvent
 *
 * This agent does NOT directly mutate Supabase.
 */

import { ToolLoopAgent, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { CRMCallOptions } from '@/types/ai';
import { createCRMTools } from '../tools';
import { formatPriorityPtBr } from '@/lib/utils/priority';
import { AI_DEFAULT_MODELS, AI_DEFAULT_PROVIDER } from '../defaults';
import { processOrchestratorTurn } from '@/lib/orchestrator/graph';

type AIProvider = 'google' | 'openai' | 'anthropic';

/** Read-only tools available to the FrontendAgent */
const FRONTEND_TOOL_NAMES = [
    'analyzePipeline',
    'getBoardMetrics',
    'searchDeals',
    'searchContacts',
    'listDealsByStage',
    'listStagnantDeals',
    'listOverdueDeals',
    'getDealDetails',
] as const;

const BASE_INSTRUCTIONS_FRONTEND = `Você é o NossoCRM Pilot, um assistente de vendas inteligente e empático. 🚀

PAPEL: Você é o AGENTE FRONT-END. Seu único papel é:
1. Conversar com o usuário de forma natural, empática e direta
2. Buscar e apresentar informações do CRM (modo leitura)
3. Identificar intenções de ação (mover deal, criar deal, etc.) e sinalizá-las para aprovação
4. NUNCA executar mutações de banco de dados diretamente

PERSONALIDADE:
- Proativo, amigável e analítico
- Emojis com moderação (máximo 2 por resposta)
- Respostas naturais (evite listas robóticas)
- Máximo 2 parágrafos por resposta

FERRAMENTAS DISPONÍVEIS (apenas leitura):
📊 analyzePipeline, getBoardMetrics
🔍 searchDeals, searchContacts, listDealsByStage, listStagnantDeals, listOverdueDeals, getDealDetails

REGRAS:
- NÃO mostre IDs/UUIDs ao usuário final
- NÃO cite nomes internos de tools
- Liste sempre de forma natural: título do deal + contato + valor + estágio
- Use o boardId do contexto automaticamente quando disponível
- Para buscas: passe APENAS o termo (ex.: "Nike"), sem frases decorativas
- Quando o usuário pedir uma AÇÃO (mover, criar, atualizar deal):
  → Informe o que será feito e aguarde confirmação via card de Aprovar/Negar
  → O BackendAgent irá executar silenciosamente após aprovação`;

export async function createFrontendAgent(
    context: CRMCallOptions,
    userId: string,
    apiKey: string,
    modelId: string = AI_DEFAULT_MODELS.google,
    provider: AIProvider = AI_DEFAULT_PROVIDER
) {
    // Run orchestrator to load/update state and classify intent
    // conversationId is not in CRMCallOptions — derive a stable key from boardId + userId
    const conversationId = `board-${context.boardId ?? 'global'}-${userId}`;
    const { state, intent, skill, shouldAIRespond, handoffMode } =
        await processOrchestratorTurn({
            orgId: context.organizationId!,
            conversationId,
            userId,
            userMessage: '',          // filled per-turn in prepareCall
            boardId: context.boardId,
            dealId: context.dealId,
            contactId: context.contactId,
        });

    console.log('[FrontendAgent] 🧠 Orchestrator state loaded:', {
        handoffMode,
        intent,
        skill,
        shouldAIRespond,
    });

    // Create provider model
    const model = buildModel(provider, apiKey, modelId);

    // Only load FRONTEND (read-only) tools
    const allTools = createCRMTools(context, userId);
    const frontendTools = Object.fromEntries(
        FRONTEND_TOOL_NAMES.map((name) => [name, allTools[name]])
    ) as Pick<ReturnType<typeof createCRMTools>, typeof FRONTEND_TOOL_NAMES[number]>;

    return {
        agent: new ToolLoopAgent({
            model,
            instructions: BASE_INSTRUCTIONS_FRONTEND,
            prepareCall: ({ options, ...settings }) => ({
                ...settings,
                instructions:
                    settings.instructions + buildContextPrompt((options ?? {}) as CRMCallOptions, state),
            }),
            tools: frontendTools,
            stopWhen: stepCountIs(8),
        }),
        orchestratorState: state,
        intent,
        skill,
        shouldAIRespond,
        handoffMode,
    };
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

function buildContextPrompt(options: CRMCallOptions, state: import('@/lib/orchestrator/agentState').AgentState): string {
    const parts: string[] = [];

    if (options.boardId) {
        parts.push(`📋 Board ID: ${options.boardId}`);
        if (options.boardName) parts.push(`   Nome: ${options.boardName}`);
    }
    if (options.dealId) parts.push(`💼 Deal ID: ${options.dealId}`);
    if (options.contactId) parts.push(`👤 Contato ID: ${options.contactId}`);
    if (options.userName) parts.push(`👋 Usuário: ${options.userName}`);

    if (options.stages && options.stages.length > 0) {
        const stageList = options.stages.map((s) => `${s.name} (${s.id})`).join(', ');
        parts.push(`🎯 Estágios: ${stageList}`);
    }

    // Orchestrator state context
    if (state.handoffMode !== 'AI') {
        parts.push(`⚠️ Modo atual: ${state.handoffMode} — aguarde instrução do vendedor`);
    }
    if (state.leadDna.pains.length > 0) {
        parts.push(`🩺 Dores identificadas: ${state.leadDna.pains.join(', ')}`);
    }
    if (state.leadDna.objections.length > 0) {
        parts.push(`🛡️ Objeções: ${state.leadDna.objections.join(', ')}`);
    }

    return parts.length > 0
        ? `\n\n====== CONTEXTO DO USUÁRIO ======\n${parts.join('\n')}`
        : '';
}

void formatPriorityPtBr; // silence unused import warning — used via tools
