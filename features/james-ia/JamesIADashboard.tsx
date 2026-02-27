'use client';

import { motion } from 'framer-motion';
import { AtomAnimation } from './AtomAnimation';
import { DashboardHeader } from './DashboardHeader';
import { DashboardLeftSidebar } from './DashboardLeftSidebar';
import { DashboardRightSidebar } from './DashboardRightSidebar';
import { DashboardFooter } from './DashboardFooter';

export function JamesIADashboard() {
  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-950 text-white flex flex-col">
      <header className="h-16 shrink-0 border-b border-white/5">
        <DashboardHeader />
      </header>

      <div className="flex-1 grid grid-cols-[300px_1fr_300px] min-h-0 overflow-hidden">
        <aside className="overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            <DashboardLeftSidebar />
          </div>
        </aside>

        <main className="flex min-w-0 items-center justify-center overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full"
          >
            <AtomAnimation />
          </motion.div>
        </main>

        <aside className="overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            <DashboardRightSidebar />
          </div>
        </aside>
      </div>

      <footer className="h-12 shrink-0 border-t border-white/5">
        <DashboardFooter />
      </footer>
    </div>
  );
}
