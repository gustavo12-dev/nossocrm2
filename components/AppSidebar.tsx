'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  Inbox,
  LayoutDashboard,
  KanbanSquare,
  ContactRound,
  CheckSquare,
  Bot,
  Headphones,
  GraduationCap,
  Filter,
  List,
  Calendar,
  UsersRound,
  UserCircle,
  CheckCircle,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Settings,
  HelpCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Zap,
  MessageCircle,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { prefetchRoute, type RouteName } from '@/lib/prefetch';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH = 256;

type NavItem = { to: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; prefetch?: RouteName };

const BLOCK_1: NavItem[] = [
  { to: '/dashboard/james-ia', label: 'James IA', icon: Sparkles, prefetch: 'james-ia' },
  { to: '#', label: 'Conectar WhatsApp', icon: LinkIcon },
  { to: '#', label: 'Chat ao Vivo', icon: MessageSquare },
];

const BLOCK_2: NavItem[] = [
  { to: '/inbox', label: 'Inbox', icon: Inbox, prefetch: 'inbox' },
  { to: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard, prefetch: 'dashboard' },
  { to: '/dashboard/boards', label: 'Boards', icon: KanbanSquare, prefetch: 'boards' },
  { to: '/dashboard/contatos', label: 'Contatos', icon: ContactRound, prefetch: 'contacts' },
  { to: '/activities', label: 'Atividades', icon: CheckSquare, prefetch: 'activities' },
];

const BLOCK_3: NavItem[] = [
  { to: '#', label: 'Agentes de IA', icon: Bot },
  { to: '#', label: 'Atendentes', icon: Headphones },
  { to: '#', label: 'Sistema de Treinamento', icon: GraduationCap },
];

const BLOCK_4: NavItem[] = [
  { to: '/dashboard/leads-crm', label: 'Leads CRM', icon: Filter },
  { to: '#', label: 'Leads Lista', icon: List },
  { to: '#', label: 'Agenda', icon: Calendar },
  { to: '#', label: 'Clientes', icon: UsersRound },
  { to: '#', label: 'Colaboradores', icon: UserCircle },
  { to: '#', label: 'Agendamentos Concluídos', icon: CheckCircle },
];

const BLOCK_5: NavItem[] = [
  { to: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign },
  { to: '/settings/products', label: 'Produtos e Serviços', icon: Package, prefetch: 'settings' },
  { to: '#', label: 'Funil de Métricas', icon: BarChart3 },
  { to: '/reports', label: 'Relatórios', icon: PieChart, prefetch: 'reports' },
];

const BLOCK_6: NavItem[] = [
  { to: '/settings', label: 'Configurações', icon: Settings, prefetch: 'settings' },
  { to: '#', label: 'FAQ & Ajuda', icon: HelpCircle },
  { to: '#', label: 'Notificações', icon: Bell },
];

const BLOCKS: Array<{ title: string; items: NavItem[] }> = [
  { title: 'IA & Comunicação', items: BLOCK_1 },
  { title: 'CRM Clássico', items: BLOCK_2 },
  { title: 'Operação de IA & Equipe', items: BLOCK_3 },
  { title: 'Leads & Vendas', items: BLOCK_4 },
  { title: 'Gestão', items: BLOCK_5 },
  { title: 'Suporte & Configs', items: BLOCK_6 },
];

function NavButton({
  to,
  label,
  icon: Icon,
  isActive,
  prefetch,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  prefetch?: RouteName;
}) {
  const className = cn(
    'flex w-full cursor-pointer items-center gap-3 overflow-hidden whitespace-nowrap rounded-lg p-2.5 text-sm transition-all',
    isActive
      ? 'border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400'
      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
  );

  if (to === '#') {
    return (
      <button type="button" className={className} aria-current={isActive ? 'page' : undefined}>
        <Icon size={20} className="shrink-0" aria-hidden />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={to}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={prefetch ? () => prefetchRoute(prefetch) : undefined}
    >
      <Icon size={20} className="shrink-0" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const displayName = profile?.nickname || profile?.first_name || profile?.email?.split('@')[0] || 'gustavo.rodrigo';
  const displayEmail = profile?.email || 'gustavo.rodrigo@4u...';
  const initials = (profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : profile?.nickname?.substring(0, 2) || profile?.email?.substring(0, 2) || 'GU'
  ).toUpperCase();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-in-out dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[20px_0_30px_rgba(0,0,0,0.5)]',
        isSidebarOpen ? 'translate-x-0 shadow-xl dark:shadow-[20px_0_30px_rgba(0,0,0,0.5)]' : '-translate-x-[calc(100%-12px)]'
      )}
      style={{ width: SIDEBAR_WIDTH }}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
      aria-label="Menu principal"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-3 dark:border-white/5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-lg" aria-hidden>
            N
          </div>
          <span className="truncate text-base font-bold text-slate-900 dark:text-white">NossoCRM</span>
        </div>
        <span className="shrink-0 text-slate-500 dark:text-zinc-400" aria-hidden>
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </span>
      </div>

      <nav
        className="app-sidebar-nav flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-2"
        aria-label="Navegação do sistema"
      >
        {BLOCKS.map((block) => (
          <div key={block.title} className="px-2">
            <p className="mb-2 mt-4 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 first:mt-0 dark:text-zinc-500">
              {block.title}
            </p>
            <div className="space-y-0.5">
              {block.items.map((item) => {
                const isActive =
                  item.to !== '#' &&
                  (pathname === item.to || (item.to === '/dashboard/boards' && pathname === '/pipeline'));
                return (
                  <NavButton
                    key={item.to + item.label}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    prefetch={item.prefetch}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto shrink-0 border-t border-slate-200 pt-4 dark:border-white/5">
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
          >
            <Zap size={14} aria-hidden />
            Modo Essencial
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
          >
            <MessageCircle size={14} aria-hidden />
            Suporte WhatsApp
          </button>
        </div>

        <div className="relative px-3 pb-4">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-500/50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white ring-2 ring-slate-200 dark:ring-white/10" aria-hidden>
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{displayName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-zinc-500">{displayEmail}</p>
            </div>
          </button>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} aria-hidden />
              <div className="absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900">
                <div className="p-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <User className="h-4 w-4 text-slate-500 dark:text-zinc-500" aria-hidden />
                    Editar Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Sair da conta
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
