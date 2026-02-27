'use client';

import { InternalPageLayout } from '@/components/InternalPageLayout';
import { Plus, Bot, BookOpen, FileText, MessageCircle } from 'lucide-react';

const MOCK_AGENTS = [
  { id: '1', name: 'James - Qualificador de Leads', status: 'ativo', description: 'Qualifica leads por interesse e momento de compra. Responde dúvidas sobre planos.', icon: 'J' },
  { id: '2', name: 'Suporte N1', status: 'treinando', description: 'Atendimento inicial e encaminhamento para humanos quando necessário.', icon: 'S' },
  { id: '3', name: 'Vendas B2B', status: 'ativo', description: 'Agenda reuniões e envia materiais comerciais para empresas.', icon: 'V' },
];

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'ativo';
  return (
    <span
      className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      }`}
    >
      {isActive ? 'Ativo' : 'Treinando'}
    </span>
  );
}

export default function DashboardAgentesPage() {
  return (
    <InternalPageLayout
      title="Agentes de IA"
      description="Gerencie seus assistentes virtuais"
      actions={
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
        >
          <Plus size={18} aria-hidden />
          Novo Agente
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_AGENTS.map((agent) => (
          <article
            key={agent.id}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 p-6 transition-all hover:border-green-500/50"
          >
            <StatusBadge status={agent.status} />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/30">
              <Bot size={28} className="text-green-400" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">{agent.name}</h2>
            <p className="mt-2 text-sm text-zinc-400">{agent.description}</p>
            <div className="mt-4 border-t border-white/5 pt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <BookOpen size={14} aria-hidden />
                Treinamento
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <FileText size={14} aria-hidden />
                Logs
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-400 transition-colors hover:bg-green-500/20"
              >
                <MessageCircle size={14} aria-hidden />
                Testar Chat
              </button>
            </div>
          </article>
        ))}
      </div>
    </InternalPageLayout>
  );
}
