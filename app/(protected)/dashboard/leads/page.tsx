'use client';

import React, { useState } from 'react';
import { InternalPageLayout } from '@/components/InternalPageLayout';
import { Search, Download, Plus, MoreHorizontal } from 'lucide-react';

const MOCK_LEADS = [
  { id: '1', name: 'Ana Silva', status: 'Qualificado', origem: 'Site', valor: 'R$ 12.500', ultimoContato: '24/02/2025', avatar: 'AS' },
  { id: '2', name: 'Bruno Costa', status: 'Frio', origem: 'Indicação', valor: 'R$ 8.000', ultimoContato: '20/02/2025', avatar: 'BC' },
  { id: '3', name: 'Carla Mendes', status: 'Perdido', origem: 'Evento', valor: 'R$ 0', ultimoContato: '15/02/2025', avatar: 'CM' },
  { id: '4', name: 'Diego Oliveira', status: 'Qualificado', origem: 'WhatsApp', valor: 'R$ 45.000', ultimoContato: '27/02/2025', avatar: 'DO' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Qualificado: 'bg-green-500/10 text-green-400 border-green-500/20',
    Frio: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Perdido: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const cls = styles[status] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export default function DashboardLeadsPage() {
  const [page, setPage] = useState(1);
  const totalPages = 1;

  return (
    <InternalPageLayout
      title="Leads / Contatos"
      description="Gerencie e qualifique seus leads"
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/5"
          >
            <Download size={18} aria-hidden />
            Exportar CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
          >
            <Plus size={18} aria-hidden />
            Adicionar Lead
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Barra de ferramentas */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              type="search"
              placeholder="Buscar leads..."
              className="w-full rounded-md border border-white/10 bg-zinc-900 py-2 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500/50 focus:outline-none"
            />
          </div>
          <select className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-green-500/50 focus:outline-none">
            <option value="">Status</option>
            <option value="qualificado">Qualificado</option>
            <option value="frio">Frio</option>
            <option value="perdido">Perdido</option>
          </select>
          <select className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-green-500/50 focus:outline-none">
            <option value="">Origem</option>
            <option value="site">Site</option>
            <option value="indicacao">Indicação</option>
            <option value="evento">Evento</option>
          </select>
          <select className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-green-500/50 focus:outline-none">
            <option value="">Data</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
          </select>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-lg border border-white/5 bg-zinc-900/30">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" className="rounded border-white/20 bg-zinc-800 text-green-500" aria-label="Selecionar todos" />
                </th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tag / Origem</th>
                <th className="px-4 py-3">Valor Estimado</th>
                <th className="px-4 py-3">Último Contato</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADS.map((row) => (
                <tr
                  key={row.id}
                  className="h-14 border-b border-white/5 transition-colors hover:bg-zinc-900/30"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-white/20 bg-zinc-800 text-green-500" aria-label={`Selecionar ${row.name}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-zinc-200">
                        {row.avatar}
                      </span>
                      <span className="font-medium text-zinc-100">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{row.origem}</td>
                  <td className="px-4 py-3 text-green-400">{row.valor}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.ultimoContato}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label={`Ações ${row.name}`}
                    >
                      <MoreHorizontal size={18} aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <p className="text-xs text-zinc-500">Mostrando 1–{MOCK_LEADS.length} de {MOCK_LEADS.length}</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 disabled:opacity-50 hover:bg-white/5"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-sm text-zinc-400">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 disabled:opacity-50 hover:bg-white/5"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </InternalPageLayout>
  );
}
