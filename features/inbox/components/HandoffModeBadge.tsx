'use client';

/**
 * HandoffModeBadge
 * Visual indicator + toggle button for Triple-Handoff mode (AI | HYBRID | HUMAN).
 * Reads/writes mode via /api/ai/handoff.
 */

import { useState, useEffect, useCallback } from 'react';
import type { HandoffMode } from '@/lib/orchestrator/handoff';

interface Props {
    conversationId: string;
    /** Initial mode (can be passed from SSR or fetched client-side) */
    initialMode?: HandoffMode;
    /** Called when mode changes — parent can use to pause AI input */
    onModeChange?: (mode: HandoffMode) => void;
}

const MODE_CONFIG: Record<HandoffMode, {
    label: string;
    emoji: string;
    description: string;
    color: string;
    bg: string;
    border: string;
}> = {
    AI: {
        label: 'IA',
        emoji: '🤖',
        description: 'IA respondendo automaticamente',
        color: '#4ade80',
        bg: 'rgba(74,222,128,0.1)',
        border: 'rgba(74,222,128,0.3)',
    },
    HYBRID: {
        label: 'Híbrido',
        emoji: '⚡',
        description: 'IA ativa, você monitora',
        color: '#facc15',
        bg: 'rgba(250,204,21,0.1)',
        border: 'rgba(250,204,21,0.3)',
    },
    HUMAN: {
        label: 'Humano',
        emoji: '👤',
        description: 'IA pausada, você no controle',
        color: '#f87171',
        bg: 'rgba(248,113,113,0.1)',
        border: 'rgba(248,113,113,0.3)',
    },
};

const NEXT_MODE: Record<HandoffMode, HandoffMode> = {
    AI: 'HYBRID',
    HYBRID: 'HUMAN',
    HUMAN: 'AI',
};

export function HandoffModeBadge({ conversationId, initialMode = 'AI', onModeChange }: Props) {
    const [mode, setMode] = useState<HandoffMode>(initialMode);
    const [loading, setLoading] = useState(false);

    const fetchMode = useCallback(async () => {
        try {
            const res = await fetch(`/api/ai/handoff?conversationId=${encodeURIComponent(conversationId)}`);
            if (res.ok) {
                const json = await res.json() as { mode: HandoffMode };
                setMode(json.mode);
            }
        } catch { /* silent */ }
    }, [conversationId]);

    useEffect(() => { fetchMode(); }, [fetchMode]);

    const cycleMode = async () => {
        const next = NEXT_MODE[mode];
        setLoading(true);
        try {
            const res = await fetch('/api/ai/handoff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, mode: next }),
            });
            if (res.ok) {
                setMode(next);
                onModeChange?.(next);
            }
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    };

    const config = MODE_CONFIG[mode];

    return (
        <button
            id={`handoff-badge-${conversationId}`}
            onClick={cycleMode}
            disabled={loading}
            title={`Modo atual: ${config.label} — clique para alterar`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 999,
                border: `1.5px solid ${config.border}`,
                background: config.bg,
                color: config.color,
                fontSize: 12,
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none',
            }}
        >
            <span style={{ fontSize: 14 }}>{config.emoji}</span>
            <span>{config.label}</span>
            {loading && <span style={{ opacity: 0.6, fontSize: 10 }}>…</span>}
        </button>
    );
}

export type { HandoffMode };
