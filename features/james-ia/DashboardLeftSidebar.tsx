'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Monitor, Shield, Save, Pin } from 'lucide-react';
import { useOptionalToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const GLASS_CARD_CLASS =
  'rounded-xl border border-white/5 bg-zinc-900/30 p-4 backdrop-blur-md transition-all hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]';

export function DashboardLeftSidebar() {
  const data = useDashboardData();
  const { addToast } = useOptionalToast();
  const [assistantId, setAssistantId] = useState('elevenlabs-agent-id');

  const handleSave = () => {
    addToast('Configuração salva com sucesso.', 'success');
  };

  return (
    <>
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
            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-green-400 outline-none placeholder:text-zinc-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
    </>
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
    <div className={cn(GLASS_CARD_CLASS, className)}>
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
    <div className="rounded-lg border border-white/5 bg-zinc-800/50 px-3 py-2">
      <span className="block text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-green-400/90">{value}</span>
    </div>
  );
}
