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
      className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-6 backdrop-blur-md"
      role="banner"
    >
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden />
        <input
          type="search"
          placeholder="Buscar clientes, colaboradores..."
          className="w-full rounded-md border border-white/10 bg-zinc-900 py-2 pl-10 pr-20 text-sm text-zinc-300 outline-none placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30"
          aria-label="Buscar"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
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
              isGlobalAIOpen ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
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
              debugEnabled ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            )}
            aria-label="Modo debug"
          >
            <Bug size={20} aria-hidden />
          </button>
          <NotificationPopover />
          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50"
            aria-label={darkMode ? 'Tema claro' : 'Tema escuro'}
          >
            {darkMode ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <span className="text-xs text-zinc-500">
            MCP Configurado: <span className="font-mono text-zinc-400">{mcpTime}</span>
          </span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
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
