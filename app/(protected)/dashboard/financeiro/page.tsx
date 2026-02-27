'use client';

import { InternalPageLayout } from '@/components/InternalPageLayout';
import { FileText, Download } from 'lucide-react';

export default function DashboardFinanceiroPage() {
  return (
    <InternalPageLayout
      title="Relatórios Financeiros"
      description="Acompanhe receitas, despesas e métricas financeiras."
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <FileText size={18} aria-hidden />
            Novo Relatório
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Download size={18} aria-hidden />
            Exportar
          </button>
        </>
      }
    >
      <div className="rounded-lg border border-white/5 bg-zinc-900/50 p-8 text-center text-zinc-400">
        <p className="text-sm">Relatórios financeiros em construção.</p>
        <p className="mt-1 text-xs">Aqui você verá gráficos e tabelas de desempenho financeiro.</p>
      </div>
    </InternalPageLayout>
  );
}
