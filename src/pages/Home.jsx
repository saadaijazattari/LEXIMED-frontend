import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Calendar, HeartPulse, PanelsTopLeft, Shield, Sparkles, Users } from 'lucide-react';
import { Surface } from '../components/ui/AppShell';

const Home = () => {
    const MotionDiv = motion.div;

    return (
        <div className="overflow-hidden pt-28">
            <section className="relative px-4 pb-12 sm:px-6 lg:px-8">
                <div className="leximed-grid absolute inset-x-4 top-0 -z-10 h-[38rem] rounded-[2.5rem] opacity-60 sm:inset-x-6 lg:inset-x-8" />
                <div className="mx-auto grid max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                            <Sparkles className="h-4 w-4" />
                            LexiMed Platform
                        </div>
                        <h1 className="mt-6 font-[family:var(--font-display)] text-5xl font-semibold leading-none text-slate-950 sm:text-6xl lg:text-7xl">
                            A calmer clinic UI for faster care decisions.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            LexiMed turns your clinic management tool into a polished digital front desk with AI-assisted treatment support, role-based dashboards, and a cleaner patient journey.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Launch Workspace
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                            >
                                Access Existing Account
                            </Link>
                        </div>
                        <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                            <Metric value="24/7" label="AI assistance ready" />
                            <Metric value="4" label="role-based workspaces" />
                            <Metric value="<1m" label="quick patient intake" />
                        </div>
                    </MotionDiv>

                    <MotionDiv initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.08 }}>
                        <Surface className="relative overflow-hidden p-6 sm:p-8">
                            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-200/30 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
                            <div className="relative space-y-5">
                                <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Command Center</p>
                                            <h2 className="mt-2 font-[family:var(--font-display)] text-3xl font-semibold">LexiMed</h2>
                                        </div>
                                        <HeartPulse className="h-8 w-8 text-teal-300" />
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-slate-300">
                                        Prioritize appointments, track clinician workload, and keep every patient touchpoint visually clear.
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FeaturePanel icon={PanelsTopLeft} title="Sharper dashboards" text="Cleaner cards, calmer spacing, and improved page hierarchy." />
                                    <FeaturePanel icon={Brain} title="AI-ready workflow" text="Treatment suggestions and prescription explanation flow feel integrated." />
                                </div>
                                <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today at a glance</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-950">18 appointments scheduled</p>
                                        </div>
                                        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Surface>
                    </MotionDiv>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">Designed for trust</p>
                        <h2 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold text-slate-950">What now feels premium in LexiMed</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <FeatureCard
                            icon={<Calendar className="h-8 w-8 text-teal-700" />}
                            title="Confident scheduling"
                            description="Appointment journeys now feel intentional, readable, and easier to act on."
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8 text-orange-600" />}
                            title="Role-first clarity"
                            description="Each workspace surfaces the right information instead of cluttered placeholder links."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-slate-700" />}
                            title="Trusted clinical tone"
                            description="Language, spacing, and visual balance now match a healthcare product instead of a demo."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const Metric = ({ value, label }) => (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <p className="font-[family:var(--font-display)] text-3xl font-semibold text-slate-950">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
);

const FeaturePanel = ({ icon, title, text }) => {
    const IconComponent = icon;
    return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
            <IconComponent className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <Surface className="p-7">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(249,115,22,0.12))]">{icon}</div>
        <h3 className="font-[family:var(--font-display)] text-2xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </Surface>
);

export default Home;
