'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { Activity, Cpu, Network } from 'lucide-react';

export function DashboardFooter() {
  const data = useDashboardData();

  return (
    <footer className="flex h-full flex-wrap items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Activity className="h-4 w-4 text-green-500/80" aria-hidden />
        <span>Atividade:</span>
        <span className="font-medium text-green-400">{data.atividade}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Cpu className="h-4 w-4 text-green-500/80 animate-pulse" aria-hidden />
        <span>Processamento:</span>
        <span className="font-medium text-green-400">{data.processamento}%</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Network className="h-4 w-4 text-green-500/80" aria-hidden />
        <span>Conexões:</span>
        <span className="font-medium text-green-400">{data.conexoes}</span>
      </div>
    </footer>
  );
}
