/**
 * Handoff API Route
 * GET/POST /api/ai/handoff
 *
 * GET  → returns current handoff mode for a conversation
 * POST → changes handoff mode (AI | HYBRID | HUMAN)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    getConversationHandoffMode,
    setConversationHandoffMode,
    isValidTransition,
    type HandoffMode,
} from '@/lib/orchestrator/handoff';

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
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
        return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    const orgId = await getOrgId();
    if (!orgId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mode = await getConversationHandoffMode(orgId, conversationId);
    return NextResponse.json({ conversationId, mode });
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const { conversationId, mode } = body as { conversationId?: string; mode?: string };

    if (!conversationId || !mode) {
        return NextResponse.json(
            { error: 'conversationId and mode are required' },
            { status: 400 }
        );
    }

    const validModes: HandoffMode[] = ['AI', 'HYBRID', 'HUMAN'];
    if (!validModes.includes(mode as HandoffMode)) {
        return NextResponse.json({ error: `Invalid mode. Must be one of: ${validModes.join(', ')}` }, { status: 400 });
    }

    const orgId = await getOrgId();
    if (!orgId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const current = await getConversationHandoffMode(orgId, conversationId);
    if (!isValidTransition(current, mode as HandoffMode)) {
        return NextResponse.json(
            { error: `Invalid transition: ${current} → ${mode}` },
            { status: 422 }
        );
    }

    const result = await setConversationHandoffMode(orgId, conversationId, mode as HandoffMode);
    return NextResponse.json(result);
}
