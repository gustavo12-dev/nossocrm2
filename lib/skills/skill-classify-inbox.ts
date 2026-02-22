/**
 * Skill: Classify Inbox
 * Tags and routes inbox conversations by intent/priority.
 */

import { tool } from 'ai';
import { z } from 'zod';

export type InboxLabel = 'HOT_LEAD' | 'OBJECTION' | 'PROPOSAL_REQUESTED' | 'FOLLOW_UP' | 'LOST' | 'NURTURE' | 'SPAM';

const LABEL_MAP: Record<InboxLabel, RegExp[]> = {
    HOT_LEAD: [/comprar|fechar|contrato|quero agora|quando posso|vamos em frente/i],
    OBJECTION: [/caro|preço|concorrente|já tenho|não preciso|outra empresa/i],
    PROPOSAL_REQUESTED: [/proposta|orçamento|cotação|quanto custa|valores/i],
    FOLLOW_UP: [/pensei|avaliei|voltei|retorno|decidi/i],
    LOST: [/não quero mais|cancelar|desistir|optamos por outro/i],
    NURTURE: [/dúvida|informação|detalhes|explicar|como funciona/i],
    SPAM: [/promoção|desconto especial|oferta imperdível|ganhou|premiado/i],
};

function classifyMessage(text: string): InboxLabel[] {
    const matched: InboxLabel[] = [];
    for (const [label, patterns] of Object.entries(LABEL_MAP) as [InboxLabel, RegExp[]][]) {
        if (patterns.some((p) => p.test(text))) matched.push(label);
    }
    return matched.length > 0 ? matched : ['NURTURE'];
}

export const classifyInboxSkill = {
    skillId: 'skill-classify-inbox',
    intentTags: ['CLASSIFY_INBOX'],
    description: 'Tags and routes inbox messages by intent',

    tools: {
        classifyMessage: tool({
            description: 'Classifica uma mensagem do inbox por intenção/prioridade',
            inputSchema: z.object({
                message: z.string().describe('Texto da mensagem a classificar'),
                conversationId: z.string().optional(),
            }),
            execute: async ({ message, conversationId }) => {
                const labels = classifyMessage(message);
                const priority = labels.includes('HOT_LEAD') || labels.includes('PROPOSAL_REQUESTED')
                    ? 'HIGH'
                    : labels.includes('LOST') || labels.includes('SPAM')
                        ? 'LOW'
                        : 'MEDIUM';

                return {
                    conversationId,
                    labels,
                    priority,
                    recommendation: labels.includes('HOT_LEAD')
                        ? '🔥 Lead quente — responder imediatamente'
                        : labels.includes('OBJECTION')
                            ? '🛡️ Objeção — use script de contorno'
                            : labels.includes('PROPOSAL_REQUESTED')
                                ? '📄 Gerar proposta'
                                : labels.includes('LOST')
                                    ? '❌ Lead perdido — mover para fase de reativação'
                                    : '📬 Nurturing — responder em até 24h',
                };
            },
        }),
    },
};
