'use client';

import { motion } from 'framer-motion';

const ATOM_SIZE = 300;
const CORE_SIZE = 60;
const RING_SIZE = 250;
const ELECTRON_SIZE = 12;

export function AtomAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: ATOM_SIZE,
          height: ATOM_SIZE,
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Núcleo (Core) com pulsaçao */}
        <motion.div
          className="absolute rounded-full z-10"
          style={{
            width: CORE_SIZE,
            height: CORE_SIZE,
            background: 'radial-gradient(circle at 30% 30%, #4ade80, #15803d)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)',
          }}
          animate={{ scale: [0.98, 1.05, 0.98] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <OrbitRing size={RING_SIZE} rotateZ={0} electronDuration={3} />
        <OrbitRing size={RING_SIZE} rotateZ={60} electronDuration={4} />
        <OrbitRing size={RING_SIZE} rotateZ={120} electronDuration={5} />
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-4xl font-bold text-green-400 tracking-tight">
          James
        </h1>
        <p className="text-sm text-zinc-400">
          AI Voice Assistant + MCP
        </p>
        <p className="mt-4 text-xs text-zinc-500 max-w-md italic">
          &ldquo;O presente é deles; o futuro, pelo qual sempre trabalhei, é meu.&rdquo;
          <span className="block mt-1 not-italic text-zinc-600">— NIKOLA TESLA</span>
        </p>
      </div>
    </div>
  );
}

interface OrbitRingProps {
  size: number;
  rotateZ: number;
  electronDuration: number;
}

function OrbitRing({ size, rotateZ, electronDuration }: OrbitRingProps) {
  const transform3d = `rotateX(70deg) rotateZ(${rotateZ}deg)`;

  return (
    <>
      {/* Anel elíptico (borda apenas) */}
      <div
        className="absolute rounded-full border-[1.5px] border-green-500/30 bg-transparent"
        style={{
          width: size,
          height: size,
          transform: transform3d,
          transformStyle: 'preserve-3d',
        }}
      />
      {/* Container do elétron: mesmo plano 3D, rotação 2D no plano */}
      <div
        className="absolute"
        style={{
          width: size,
          height: size,
          transform: transform3d,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformOrigin: 'center center' }}
          animate={{ rotate: 360 }}
          transition={{
            duration: electronDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="absolute rounded-full bg-green-400"
            style={{
              width: ELECTRON_SIZE,
              height: ELECTRON_SIZE,
              top: 0,
              left: '50%',
              marginLeft: -ELECTRON_SIZE / 2,
              marginTop: -ELECTRON_SIZE / 2,
              boxShadow: '0 0 15px #4ade80, 0 0 25px rgba(74, 222, 128, 0.6)',
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
