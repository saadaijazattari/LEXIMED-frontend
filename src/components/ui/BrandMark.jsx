import React from 'react';
import { Brain, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandMark = ({ compact = false }) => {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3"
    >
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] shadow-[0_18px_40px_rgba(15,118,110,0.24)]">
        <HeartPulse className="h-5 w-5 text-white" />
        <Brain className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white/20 p-0.5 text-white backdrop-blur" />
      </div>
      <div className={compact ? 'hidden sm:block' : ''}>
        <p className="font-[family:var(--font-display)] text-lg font-semibold tracking-[0.24em] text-slate-900 uppercase">
          LexiMed
        </p>
        <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
          Clinic OS
        </p>
      </div>
    </MotionDiv>
  );
};

export default BrandMark;
