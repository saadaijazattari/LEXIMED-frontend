import React from 'react';
import { motion } from 'framer-motion';
import { Paper } from '@mui/material';

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const DashboardPage = ({ eyebrow, title, description, actions, children }) => {
  const MotionDiv = motion.div;

  return (
    <MotionDiv {...pageTransition} className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-4 top-16 -z-10 h-48 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_55%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_45%)] blur-3xl sm:inset-x-6 lg:inset-x-8" />
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">{eyebrow}</p> : null}
          <h1 className="font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>
          {description ? <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </MotionDiv>
  );
};

export const Surface = ({ className = '', children }) => {
  return (
    <Paper
      elevation={0}
      className={`rounded-[28px] border border-white/70 bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      {children}
    </Paper>
  );
};

export const StatCard = ({ icon: Icon, label, value, tone = 'teal', meta }) => {
  const MotionDiv = motion.div;
  const toneClasses = {
    teal: 'from-teal-500/15 to-cyan-500/10 text-teal-700',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700',
    rose: 'from-rose-500/15 to-pink-500/10 text-rose-700',
    slate: 'from-slate-500/15 to-slate-300/10 text-slate-700',
  };

  return (
    <MotionDiv whileHover={{ y: -4 }} className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold text-slate-950">{value}</p>
          {meta ? <p className="mt-2 text-sm text-slate-500">{meta}</p> : null}
        </div>
        {Icon ? (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[tone] || toneClasses.teal}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </MotionDiv>
  );
};

export const SectionTitle = ({ title, subtitle, action }) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="font-[family:var(--font-display)] text-2xl font-semibold text-slate-950">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
    {action}
  </div>
);

export const DashboardTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="mb-6 flex flex-wrap gap-3">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const active = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            active
              ? 'bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]'
              : 'bg-white/70 text-slate-600 ring-1 ring-slate-200 hover:bg-white'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{tab.name}</span>
        </button>
      );
    })}
  </div>
);
