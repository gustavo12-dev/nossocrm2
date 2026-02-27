'use client';

import { InternalPageLayout } from '@/components/InternalPageLayout';
import { Plus, Upload } from 'lucide-react';
import { BoardsInternalView } from '@/components/dashboard/BoardsInternalView';

export default function DashboardBoardsPage() {
  return (
    <InternalPageLayout
      title="Quadros"
      description="Pipeline de negócios em colunas. Arraste os cards entre etapas."
      actions={
        <>
          <select className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-green-500/50 focus:outline-none">
            <option>Vendas B2B</option>
            <option>Vendas B2C</option>
            <option>Suporte</option>
          </select>
          <select className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-green-500/50 focus:outline-none">
            <option value="">Responsável</option>
            <option value="todos">Todos</option>
            <option value="eu">Só eu</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Plus size={18} aria-hidden />
            Novo Card
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Upload size={18} aria-hidden />
            Importar
          </button>
        </>
      }
    >
      <BoardsInternalView />
    </InternalPageLayout>
  );
}
