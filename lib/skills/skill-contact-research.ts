/**
 * Skill: Contact Research
 * Enriches contact data from public sources and saves to Supabase.
 * Currently uses structured text analysis; connect a real scraping API to enrich further.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { createStaticAdminClient } from '@/lib/supabase/staticAdminClient';
import { redis, contactEnrichmentKey, TTL } from '@/lib/upstash';

export interface EnrichmentData {
    linkedinUrl?: string;
    companyWebsite?: string;
    companySize?: string;
    industry?: string;
    location?: string;
    enrichedAt: string;
    source: 'manual' | 'auto';
}

export const contactResearchSkill = {
    skillId: 'skill-contact-research',
    intentTags: ['CONTACT_RESEARCH'],
    description: 'Enriches contact and company data from available sources',

    tools: {
        enrichContact: tool({
            description: 'Enriquece os dados de um contato com informações públicas (LinkedIn, site)',
            inputSchema: z.object({
                contactId: z.string(),
                organizationId: z.string(),
                linkedinUrl: z.string().url().optional(),
                companyWebsite: z.string().url().optional(),
                companySize: z.string().optional().describe('Ex: 1-10, 11-50, 51-200, 201-500, 500+'),
                industry: z.string().optional(),
                location: z.string().optional(),
            }),
            execute: async (params) => {
                const supabase = createStaticAdminClient();
                const enrichment: EnrichmentData = {
                    linkedinUrl: params.linkedinUrl,
                    companyWebsite: params.companyWebsite,
                    companySize: params.companySize,
                    industry: params.industry,
                    location: params.location,
                    enrichedAt: new Date().toISOString(),
                    source: 'auto',
                };

                // Cache in Upstash for fast access
                await redis.set(
                    contactEnrichmentKey(params.organizationId, params.contactId),
                    enrichment,
                    { ex: TTL.enrichment }
                );

                // Persist to Supabase contacts.enrichment_data (jsonb column)
                const { error } = await supabase
                    .from('contacts')
                    .update({ enrichment_data: enrichment })
                    .eq('organization_id', params.organizationId)
                    .eq('id', params.contactId);

                if (error) return { success: false, error: error.message };

                return {
                    success: true,
                    message: `✅ Contato enriquecido com ${[enrichment.linkedinUrl, enrichment.companyWebsite, enrichment.companySize, enrichment.industry, enrichment.location].filter(Boolean).length} campos`,
                    enrichment,
                };
            },
        }),

        getContactEnrichment: tool({
            description: 'Busca os dados de enriquecimento de um contato (cache Upstash ou Supabase)',
            inputSchema: z.object({
                contactId: z.string(),
                organizationId: z.string(),
            }),
            execute: async ({ contactId, organizationId }) => {
                // Try Upstash first
                const cached = await redis.get<EnrichmentData>(
                    contactEnrichmentKey(organizationId, contactId)
                );
                if (cached) return { source: 'cache', enrichment: cached };

                // Fall back to Supabase
                const supabase = createStaticAdminClient();
                const { data, error } = await supabase
                    .from('contacts')
                    .select('enrichment_data, name, company_name')
                    .eq('organization_id', organizationId)
                    .eq('id', contactId)
                    .single();

                if (error) return { error: error.message };
                return {
                    source: 'supabase',
                    contactName: data.name,
                    company: data.company_name,
                    enrichment: data.enrichment_data ?? null,
                };
            },
        }),
    },
};
