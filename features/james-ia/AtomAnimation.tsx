'use client';

import { motion } from 'framer-motion';

const RING_ROTATIONS: Array<{ z: number; duration: number }> = [
  { z: 0, duration: 3 },
  { z: 60, duration: 4 },
  { z: 120, duration: 5 },
];

export function AtomAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* A. Container Pai */}
      <div
        className="w-80 h-80 relative flex items-center justify-center [perspective:1000px]"
      >
        {/* B. Núcleo */}
        <motion.div
          className="absolute z-10 w-16 h-16 rounded-full bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.8)]"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* C. Órbitas e Elétrons: Ring Wrapper + Motor + Elétron */}
        {RING_ROTATIONS.map(({ z, duration }) => (
          <div
            key={z}
            className="absolute inset-0 m-auto w-64 h-64 border border-green-500/20 rounded-full"
            style={{
              transform: `rotateX(75deg) rotateY(0deg) rotateZ(${z}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ transformOrigin: 'center center' }}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80]" />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Textos embaixo do Átomo */}
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
          James
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          AI Voice Assistant + MCP
        </p>
        <p className="mt-8 max-w-sm mx-auto text-xs text-zinc-500 italic">
          &ldquo;O presente é deles; o futuro, pelo qual sempre trabalhei, é meu.&rdquo;
          <span className="block mt-1 not-italic">— NIKOLA TESLA</span>
        </p>
      </div>
    </div>
  );
}
