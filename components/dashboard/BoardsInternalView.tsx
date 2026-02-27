'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const KANBAN_COLUMNS = [
  { id: 'prospect', title: 'Prospect', count: 2 },
  { id: 'qualificado', title: 'Qualificado', count: 3 },
  { id: 'proposta', title: 'Proposta', count: 1 },
  { id: 'ganho', title: 'Ganho', count: 2 },
  { id: 'perdido', title: 'Perdido', count: 0 },
] as const;

const MOCK_CARDS = [
  { id: '1', columnId: 'prospect', company: 'Tech Solutions Ltda', value: '$ 45.000', tags: ['Urgente'], assignee: 'GR', date: '24/02' },
  { id: '2', columnId: 'prospect', company: 'Indústria Beta', value: '$ 12.500', tags: ['NPS Alto'], assignee: 'TS', date: '25/02' },
  { id: '3', columnId: 'qualificado', company: 'Comércio Delta', value: '$ 78.200', tags: ['Urgente', 'NPS Alto'], assignee: 'GR', date: '23/02' },
  { id: '4', columnId: 'qualificado', company: 'Serviços Omega', value: '$ 33.000', tags: [], assignee: 'TS', date: '26/02' },
  { id: '5', columnId: 'qualificado', company: 'Logística Norte', value: '$ 21.000', tags: ['Novo'], assignee: 'GR', date: '27/02' },
  { id: '6', columnId: 'proposta', company: 'Varejo Sul', value: '$ 156.000', tags: ['Urgente'], assignee: 'TS', date: '20/02' },
  { id: '7', columnId: 'ganho', company: 'Consultoria XYZ', value: '$ 89.000', tags: ['NPS Alto'], assignee: 'GR', date: '15/02' },
  { id: '8', columnId: 'ganho', company: 'Software House', value: '$ 210.000', tags: [], assignee: 'TS', date: '10/02' },
];

function KanbanCard({
  company,
  value,
  tags,
  assignee,
  date,
}: {
  company: string;
  value: string;
  tags: string[];
  assignee: string;
  date: string;
}) {
  return (
    <motion.div
      layout
      initial={false}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="cursor-pointer rounded-lg border border-white/5 bg-zinc-900 p-4 shadow-md transition-shadow hover:border-white/10"
    >
      <p className="text-sm font-bold text-white">{company}</p>
      <p className="mt-1 text-sm text-green-400">{value}</p>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                tag === 'Urgente' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          {assignee}
        </span>
        <span>{date}</span>
      </div>
    </motion.div>
  );
}

export function BoardsInternalView() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {KANBAN_COLUMNS.map((col) => {
          const cards = MOCK_CARDS.filter((c) => c.columnId === col.id);
          return (
            <div
              key={col.id}
              className="w-72 shrink-0 rounded-lg border border-white/5 bg-zinc-900/30 p-4"
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                {col.title}
              </h2>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-zinc-500">{cards.length} cards</span>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={`Adicionar card em ${col.title}`}
                >
                  <Plus size={18} aria-hidden />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {cards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    company={card.company}
                    value={card.value}
                    tags={card.tags}
                    assignee={card.assignee}
                    date={card.date}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
