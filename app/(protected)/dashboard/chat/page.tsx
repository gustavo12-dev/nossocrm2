'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
} from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Ana Silva', preview: 'Obrigado pelo retorno!', time: '10:42', unread: 2, avatar: 'AS' },
  { id: '2', name: 'Bruno Costa', preview: 'Preciso de uma proposta até sexta.', time: '09:15', unread: 0, avatar: 'BC' },
  { id: '3', name: 'Carla Mendes', preview: 'Podemos agendar uma reunião?', time: 'Ontem', unread: 1, avatar: 'CM' },
];

const MOCK_MESSAGES = [
  { id: 'm1', from: 'lead', text: 'Olá, gostaria de saber mais sobre o plano Enterprise.', time: '10:38' },
  { id: 'm2', from: 'agent', text: 'Olá! Claro, o plano Enterprise inclui suporte prioritário e SLA 99,9%. Posso te enviar um material?', time: '10:40' },
  { id: 'm3', from: 'lead', text: 'Sim, por favor. E qual o valor?', time: '10:42' },
];

export default function DashboardChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0]?.id ?? null);
  const [message, setMessage] = useState('');

  const selected = MOCK_CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-0 bg-zinc-950 text-zinc-100">
      {/* Painel esquerdo - Lista de conversas */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-white/5 bg-zinc-900">
        <div className="shrink-0 border-b border-white/5 p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden />
              <input
                type="search"
                placeholder="Pesquisar conversas..."
                className="w-full rounded-md border border-white/10 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="rounded-md border border-white/10 bg-zinc-950 p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Filtros"
            >
              <Filter size={18} aria-hidden />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setSelectedId(conv.id)}
              className={`flex w-full items-start gap-3 border-b border-white/5 p-4 text-left transition-colors hover:bg-zinc-900/50 ${
                selectedId === conv.id ? 'bg-zinc-900/80' : ''
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {conv.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-zinc-100">{conv.name}</span>
                  <span className="shrink-0 text-xs text-zinc-500">{conv.time}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-zinc-400">{conv.preview}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-green-500/20 px-1.5 text-xs font-medium text-green-400">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Painel direito - Área da mensagem */}
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-950">
        {selected ? (
          <>
            {/* Header da conversa */}
            <header className="flex shrink-0 items-center justify-between border-b border-white/5 bg-zinc-900/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {selected.avatar}
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">{selected.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Ligar"
                >
                  <Phone size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Vídeo"
                >
                  <Video size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal size={20} aria-hidden />
                </button>
              </div>
            </header>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto bg-zinc-950/50 p-6">
              <div className="space-y-4">
                {MOCK_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg border px-4 py-2.5 ${
                        msg.from === 'lead'
                          ? 'bg-zinc-900 border-white/5 text-left'
                          : 'bg-green-900/20 border-green-500/20 text-right'
                      }`}
                    >
                      <p className="text-sm text-zinc-100">{msg.text}</p>
                      <p className="mt-1 text-xs text-zinc-500">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé - Input */}
            <div className="shrink-0 border-t border-white/5 bg-zinc-900/50 p-4">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Anexar"
                >
                  <Paperclip size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Emoji"
                >
                  <Smile size={20} aria-hidden />
                </button>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className="min-h-[40px] flex-1 resize-none rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-green-600 p-2.5 text-white transition-colors hover:bg-green-500"
                  aria-label="Enviar"
                >
                  <Send size={20} aria-hidden />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-500">
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  );
}
