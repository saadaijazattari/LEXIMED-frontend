import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Surface } from './AppShell';
import BrandMark from './BrandMark';

const AuthLayout = ({ title, subtitle, points, alternateLabel, alternateTo, alternateText, children }) => {
  const MotionDiv = motion.div;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#f7faf9_0%,#eef6f4_45%,#fff7ed_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_35%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:gap-12">
        <MotionDiv
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden flex-1 lg:block"
        >
          <BrandMark />
          <div className="mt-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-700">LexiMed Experience</p>
            <h1 className="mt-4 font-[family:var(--font-display)] text-5xl font-semibold leading-tight text-slate-950">
              Human-centered clinic operations with AI-assisted clarity.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Smoother patient intake, clearer scheduling, and a calmer staff dashboard wrapped in a modern healthcare interface.
            </p>
            <div className="mt-8 space-y-4">
              {points.map((point) => (
                <div key={point} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="w-full lg:max-w-xl"
        >
          <Surface className="p-6 sm:p-8">
            <div className="mb-8 lg:hidden">
              <BrandMark compact />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">Secure Access</p>
            <h2 className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-sm text-slate-500">
              {alternateText}{' '}
              <Link to={alternateTo} className="font-semibold text-teal-700 transition hover:text-teal-800">
                {alternateLabel}
              </Link>
            </p>
          </Surface>
        </MotionDiv>
      </div>
    </div>
  );
};

export default AuthLayout;
