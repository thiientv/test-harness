"use client";

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/mathHelpers'; // Can map tailwind-merge helper

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'cyan' | 'purple' | 'default';
  isVisible?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  isVisible = true,
  delay = 0,
}: GlassCardProps) {
  const variantClass = {
    default: 'glass-panel',
    cyan: 'glass-panel-cyan',
    purple: 'glass-panel-purple',
  }[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1] // Custom easeOutExpo
          }}
          className={cn(
            "rounded-xl p-8 backdrop-blur-md text-white select-none overflow-hidden relative",
            variantClass,
            className
          )}
        >
          {/* Subtle noise pattern or gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.01] to-white/[0.04] pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
