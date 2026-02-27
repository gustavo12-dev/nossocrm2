'use client';

import { useDashboardData, formatDashboardDateTime } from '@/hooks/useDashboardData';
import { Search, Sun, Moon, RefreshCw, Download, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const data = useDashboardData();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex h-full flex-wrap items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <span className="font-semibold text-white">James IA</span>
        </div>
        <span className="text-sm text-zinc-500" suppressHydrationWarning>
          {formatDashboardDateTime(data.dataHora)}
        </span>
        <a
          href="#como-usar"
          className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20 hover:border-green-500/70"
        >
          Como usar?
        </a>
      </div>

      <div className="flex flex-1 justify-center px-4 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden />
          <input
            type="search"
            placeholder="Buscar clientes, colaborador"
            className="w-full rounded-lg bg-zinc-950 border border-white/10 text-green-400 py-2 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            aria-label="Buscar"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          MCP Configurado
        </span>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Atualizar Prompts
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-green-400"
        >
          <Download className="h-4 w-4" aria-hidden />
          Importar James no n8n
        </button>
        <button
          type="button"
          onClick={toggleDarkMode}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            darkMode
              ? 'bg-green-500/20 text-green-400'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          )}
          aria-label={darkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
        >
          {darkMode ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
          {darkMode ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}
