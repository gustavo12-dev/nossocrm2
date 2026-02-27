'use client';

import { InternalPageLayout } from '@/components/InternalPageLayout';
import { Plus, Upload } from 'lucide-react';
import { ContatosInternalView } from '@/components/dashboard/ContatosInternalView';

export default function DashboardContatosPage() {
  return (
    <InternalPageLayout
      title="Contatos"
      description="Gerencie pessoas e empresas. Filtros e visualização em lista ou cartões."
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Plus size={18} aria-hidden />
            Novo Contato
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Upload size={18} aria-hidden />
            Importar
          </button>
        </>
      }
    >
      <ContatosInternalView />
    </InternalPageLayout>
  );
}
