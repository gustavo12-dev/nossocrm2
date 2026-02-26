'use client';

import { motion } from 'framer-motion';
import { AtomAnimation } from './AtomAnimation';
import { DashboardHeader } from './DashboardHeader';
import { DashboardLeftSidebar } from './DashboardLeftSidebar';
import { DashboardRightSidebar } from './DashboardRightSidebar';
import { DashboardFooter } from './DashboardFooter';

export function JamesIADashboard() {
  return (
    <div className="grid min-h-full grid-cols-[1fr] grid-rows-[auto_1fr_auto] bg-[#050505] md:grid-cols-[240px_1fr_240px] lg:grid-cols-[280px_1fr_280px] md:h-[calc(100vh-4rem)]">
      <div className="col-span-full">
        <DashboardHeader />
      </div>

      <div className="hidden min-h-0 overflow-y-auto md:block">
        <DashboardLeftSidebar />
      </div>

      <main className="flex min-h-0 min-w-0 flex-col items-center justify-center overflow-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          <AtomAnimation />
        </motion.div>
      </main>

      <div className="hidden min-h-0 overflow-y-auto lg:block">
        <DashboardRightSidebar />
      </div>

      <div className="col-span-full">
        <DashboardFooter />
      </div>
    </div>
  );
}
