"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { isWebGLAvailable } from '../utils/webgl-check';
import { NeuralStateProvider } from '../context/NeuralStateContext';
import ErrorBoundary from '../components/ErrorBoundary';
import ModernPageLayout from '../components/layout/ModernPageLayout';
import FallbackLayout from '../components/layout/FallbackLayout';

// Lazily load dynamic 3D React Three Fiber Canvas with `{ ssr: false }`
// to ensure zero server context/browser hydration loop crashes
const NeuralCanvas = dynamic(
  () => import('../components/neural/NeuralCanvas'),
  { ssr: false }
);

export default function Home() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Run hardware verification check on client mount
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Show dark background while checking device capabilities
  if (hasWebGL === null) {
    return (
      <div className="w-screen h-screen bg-[#010103] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  // Load the lightweight 2D fallback layout if WebGL context check fails
  if (!hasWebGL) {
    return <FallbackLayout />;
  }

  return (
    <NeuralStateProvider>
      <ErrorBoundary>
        <main className="w-screen h-screen overflow-hidden relative">
          {/* Dynamic 3D WebGL Canvas Layer */}
          <NeuralCanvas />

          {/* Scrolling Interface Layer overlaid transparently */}
          <ModernPageLayout />
        </main>
      </ErrorBoundary>
    </NeuralStateProvider>
  );
}
