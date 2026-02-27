'use client';

import React, { useState } from 'react';
import { Search, Filter, List, LayoutGrid, MoreHorizontal } from 'lucide-react';

const MOCK_CONTACTS = [
  { id: '1', name: 'Ana Silva', status: 'Ativo', etapa: 'Qualificado', origem: 'Site', email: 'ana.silva@empresa.com', celular: '(11) 98765-4321', criadoEm: '20/02/2025' },
  { id: '2', name: 'Bruno Costa', status: 'Pendente', etapa: 'Prospect', origem: 'Indicação', email: 'bruno@tech.com', celular: '(21) 99876-5432', criadoEm: '22/02/2025' },
  { id: '3', name: 'Carla Mendes', status: 'Ativo', etapa: 'Proposta', origem: 'Evento', email: 'carla.m@consultoria.com', celular: '(31) 97654-3210', criadoEm: '24/02/2025' },
  { id: '4', name: 'Diego Oliveira', status: 'Perdido', etapa: 'Perdido', origem: 'Site', email: 'diego@startup.io', celular: '(41) 96543-2109', criadoEm: '15/02/2025' },
  { id: '5', name: 'Elena Santos', status: 'Ativo', etapa: 'Ganho', origem: 'WhatsApp', email: 'elena.s@varejo.com', celular: '(51) 95432-1098', criadoEm: '10/02/2025' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Ativo: 'bg-emerald-500/20 text-emerald-400',
    Pendente: 'bg-amber-500/20 text-amber-400',
    Perdido: 'bg-red-500/20 text-red-400',
  };
  const cls = styles[status] ?? 'bg-zinc-500/20 text-zinc-400';
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export function ContatosInternalView() {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const total = MOCK_CONTACTS.length;
  const perPage = 5;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const rows = MOCK_CONTACTS.slice(start, start + perPage);

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/50 p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Pesquisar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-zinc-900 py-2 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-green-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5"
        >
          <Filter size={18} aria-hidden />
          Filtros
        </button>
        <div className="flex rounded-lg border border-white/10 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-md p-2 ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            aria-label="Visualização em lista"
          >
            <List size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`rounded-md p-2 ${viewMode === 'cards' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            aria-label="Visualização em cartões"
          >
            <LayoutGrid size={18} aria-hidden />
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-white/5 bg-zinc-900/30">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/50">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-white/20 bg-zinc-800 text-green-500 focus:ring-green-500/50" aria-label="Selecionar todos" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Etapa</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Origem</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Celular</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Criado em</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-white/20 bg-zinc-800 text-green-500 focus:ring-green-500/50" aria-label={`Selecionar ${row.name}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {row.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                      <span className="font-medium text-white">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{row.etapa}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.origem}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.celular}</td>
                  <td className="px-4 py-3 text-zinc-500">{row.criadoEm}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label={`Ações para ${row.name}`}
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
        <div className="flex items-center justify-between border-t border-white/5 bg-zinc-900/30 px-4 py-3">
          <p className="text-xs text-zinc-500">
            Mostrando {start + 1}–{Math.min(start + perPage, total)} de {total} registros
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 disabled:opacity-50 hover:bg-white/5"
            >
              Anterior
            </button>
            <span className="text-sm text-zinc-400">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 disabled:opacity-50 hover:bg-white/5"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
