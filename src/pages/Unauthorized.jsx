import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Surface } from '../components/ui/AppShell';

const Unauthorized = () => {
    const MotionDiv = motion.div;

    return (
        <div className="flex min-h-screen items-center justify-center px-4 pt-28 pb-10">
            <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <Surface className="p-8 text-center sm:p-12">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-rose-50 text-rose-600">
                        <Shield className="h-12 w-12" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">Restricted Route</p>
                    <h1 className="mt-4 font-[family:var(--font-display)] text-5xl font-semibold text-slate-950">
                        403 Unauthorized
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-slate-600">
                        This area is outside your current permissions. Return to the main workspace and continue from an allowed dashboard.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Home className="h-4 w-4" />
                        <span>Return Home</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Surface>
            </MotionDiv>
        </div>
    );
};

export default Unauthorized;
