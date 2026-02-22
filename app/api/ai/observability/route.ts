/**
 * Observability API Route
 * GET /api/ai/observability?date=YYYY-MM-DD&limit=50
 *
 * Returns the most recent OrchestratorStep events from Upstash
 * for the authenticated user's organization.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redis, observabilityLogKey } from '@/lib/upstash';
import type { OrchestratorStep } from '@/lib/orchestrator/agentState';

export const runtime = 'edge';

async function getOrgId(): Promise<string | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', user.id)
            .limit(1)
            .single();
        return data?.organization_id ?? null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

    const orgId = await getOrgId();
    if (!orgId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const raw = await redis.lrange<string>(observabilityLogKey(orgId, date), 0, limit - 1);
        const steps: OrchestratorStep[] = raw
            .map((item) => {
                try {
                    return typeof item === 'string' ? JSON.parse(item) : item;
                } catch {
                    return null;
                }
            })
            .filter(Boolean) as OrchestratorStep[];

        return NextResponse.json({ date, total: steps.length, steps });
    } catch (err) {
        console.error('[Observability] Failed to load steps:', err);
        return NextResponse.json({ error: 'Failed to load observability data' }, { status: 500 });
    }
}
