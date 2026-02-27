'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { Activity, Cpu, Network } from 'lucide-react';

export function DashboardFooter() {
  const data = useDashboardData();
  const isAlta = data.atividade === 'Alta';

  return (
    <footer className="flex h-full flex-wrap items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
          <Activity className="h-4 w-4 text-green-500/80" />
          {isAlta && (
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-90 animate-ping" />
          )}
          {isAlta && (
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-500" />
          )}
        </span>
        <span>Atividade:</span>
        <span className="font-medium text-green-400">{data.atividade}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Cpu className="h-4 w-4 text-green-500/80 animate-pulse" aria-hidden />
        <span>Processamento:</span>
        <span className="font-medium text-green-400">{data.processamento}%</span>
        <div className="w-24 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-1.5 rounded-full bg-green-500/80 transition-all duration-500"
            style={{ width: `${data.processamento}%` }}
            role="progressbar"
            aria-valuenow={data.processamento}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Network className="h-4 w-4 text-green-500/80" aria-hidden />
        <span>Conexões:</span>
        <span className="font-medium text-green-400">{data.conexoes}</span>
      </div>
    </footer>
  );
}
