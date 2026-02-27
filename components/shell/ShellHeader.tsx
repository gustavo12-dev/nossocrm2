'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, Bug, Sun, Moon, RefreshCw, Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCRM } from '@/context/CRMContext';
import { isDebugMode, enableDebugMode, disableDebugMode } from '@/lib/debug';
import { NotificationPopover } from '@/components/notifications/NotificationPopover';
import { cn } from '@/lib/utils';

export function ShellHeader() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { isGlobalAIOpen, setIsGlobalAIOpen } = useCRM();
  const [mcpTime, setMcpTime] = useState('00:00:00');
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    setDebugEnabled(isDebugMode());
  }, []);

  useEffect(() => {
    const format = (n: number) => n.toString().padStart(2, '0');
    const update = () => {
      const d = new Date();
      setMcpTime(`${format(d.getHours())}:${format(d.getMinutes())}:${format(d.getSeconds())}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleDebug = () => {
    if (debugEnabled) {
      disableDebugMode();
      setDebugEnabled(false);
    } else {
      enableDebugMode();
      setDebugEnabled(true);
    }
  };

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-100/90 px-6 backdrop-blur-md dark:border-white/5 dark:bg-zinc-950/80"
      role="banner"
    >
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" aria-hidden />
        <input
          type="search"
          placeholder="Buscar clientes, colaboradores..."
          className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-20 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-500"
          aria-label="Buscar"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400">
          Ctrl+K
        </kbd>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsGlobalAIOpen(!isGlobalAIOpen)}
            className={cn(
              'rounded-lg p-2 transition-all focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50',
              isGlobalAIOpen ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
            )}
            aria-label={isGlobalAIOpen ? 'Fechar assistente IA' : 'Abrir assistente IA'}
          >
            <Sparkles size={20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={toggleDebug}
            className={cn(
              'rounded-lg p-2 transition-all focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50',
              debugEnabled ? 'bg-purple-500/20 text-purple-600 ring-1 ring-purple-500/30 dark:text-purple-400' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
            )}
            aria-label="Modo debug"
          >
            <Bug size={20} aria-hidden />
          </button>
          <NotificationPopover />
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label={darkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          >
            {darkMode ? <Moon size={20} aria-hidden /> : <Sun size={20} aria-hidden />}
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-zinc-500">
            MCP Configurado: <span className="font-mono text-slate-600 dark:text-zinc-400">{mcpTime}</span>
          </span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-white/20 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <RefreshCw size={16} aria-hidden />
            Atualizar Prompts
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-500"
          >
            <Download size={16} aria-hidden />
            Importar James no n8n
          </button>
        </div>
      </div>
    </header>
  );
}
