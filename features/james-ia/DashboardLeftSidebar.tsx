'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Monitor, Shield, Save, Pin } from 'lucide-react';
import { useOptionalToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export function DashboardLeftSidebar() {
  const data = useDashboardData();
  const { addToast } = useOptionalToast();
  const [assistantId, setAssistantId] = useState('elevenlabs-agent-id');

  const handleSave = () => {
    addToast('Configuração salva com sucesso.', 'success');
  };

  return (
    <aside className="flex flex-col gap-4 overflow-y-auto p-4">
      <GlassCard title="Sistema" icon={<Monitor className="h-4 w-4 text-green-400/80" aria-hidden />}>
        <div className="flex flex-wrap gap-2">
          <MetricBadge label="RAM" value={`${data.ram}%`} />
          <MetricBadge label="REDE" value={data.rede} />
        </div>
      </GlassCard>

      <GlassCard title="Segurança" icon={<Shield className="h-4 w-4 text-green-400/80" aria-hidden />}>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-500">FIREWALL</span>
            <span className="font-medium text-green-400">{data.firewallAtivo ? 'ATIVO' : 'INATIVO'}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-500">INTRUSÕES</span>
            <span className="font-medium text-zinc-300">{data.intrusoes}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-500">ÚLTIMA VARREDURA</span>
            <span className="font-medium text-zinc-400">{data.ultimaVarredura}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Conexão ElevenLabs" icon={<Pin className="h-4 w-4 text-green-400/80" aria-hidden />}>
        <div className="flex flex-col gap-3">
          <label htmlFor="james-assistant-id" className="sr-only">
            Assistant ID
          </label>
          <input
            id="james-assistant-id"
            type="text"
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
            placeholder="elevenlabs-agent-id"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-green-500/50 focus:outline-none focus:ring-1 focus:ring-green-500/30"
          />
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-green-400"
          >
            <Save className="h-4 w-4" aria-hidden />
            Salvar
          </button>
        </div>
      </GlassCard>
    </aside>
  );
}

function GlassCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-shadow hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]',
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-3 py-2">
      <span className="block text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-green-400/90">{value}</span>
    </div>
  );
}
