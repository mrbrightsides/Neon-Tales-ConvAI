'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';
import { KeyboardControls } from '@react-three/drei';
import { InputProvider } from './Input';

// Default keyboard map - can be extended
const KEYBOARD_MAP = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'interact', keys: ['KeyE'] },
  { name: 'rotateLeft', keys: ['KeyQ'] },
  { name: 'rotateRight', keys: ['KeyE'] },
];

interface GameCanvasProps {
  children: ReactNode;
  overlay?: ReactNode;
}

export function GameCanvas({ children, overlay }: GameCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#111]">
      <InputProvider>
        <KeyboardControls map={KEYBOARD_MAP}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 2, 6], fov: 55 }}
            className="touch-none"
          >
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </Canvas>
          {/* UI Overlay layer (outside Canvas) */}
          <div className="absolute inset-0 pointer-events-none">
            {overlay}
          </div>
        </KeyboardControls>
      </InputProvider>
    </div>
  );
}
