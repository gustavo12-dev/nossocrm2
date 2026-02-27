'use client';

import React from 'react';

export interface InternalPageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout padrão das páginas internas do CRM: fundo dark, cabeçalho com título,
 * descrição e botões de ação, conteúdo em container p-6.
 */
export function InternalPageLayout({
  title,
  description,
  actions,
  children,
  className = '',
}: InternalPageLayoutProps) {
  return (
    <div className={`min-h-full bg-zinc-950 text-white ${className}`}>
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          )}
        </div>
        {actions && <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
