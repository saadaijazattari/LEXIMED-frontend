import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../utils/constants';
import BrandMark from '../ui/BrandMark';

const Navbar = () => {
    const MotionDiv = motion.div;
    const { user, isAuthenticated, logout, hasAnyRole } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user?.role) return '/';

        switch (user.role) {
            case ROLES.ADMIN:
                return ROUTES.DASHBOARD[ROLES.ADMIN];
            case ROLES.DOCTOR:
                return ROUTES.DASHBOARD[ROLES.DOCTOR];
            case ROLES.PATIENT:
                return ROUTES.DASHBOARD[ROLES.PATIENT];
            case ROLES.RECEPTIONIST:
                return ROUTES.DASHBOARD[ROLES.RECEPTIONIST];
            default:
                return '/';
        }
    };

    const navItems = isAuthenticated
        ? [
            { label: 'Overview', to: '/' },
            { label: 'Workspace', to: getDashboardLink() },
            ...(hasAnyRole([ROLES.DOCTOR, ROLES.ADMIN]) ? [{ label: 'Clinician View', to: ROUTES.DASHBOARD[ROLES.DOCTOR] }] : []),
          ]
        : [
            { label: 'Platform', to: '/' },
            { label: 'Sign In', to: '/login' },
          ];

    return (
        <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-[26px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center">
                            <BrandMark compact />
                        </Link>
                        <div className="hidden rounded-full bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(249,115,22,0.12))] px-3 py-1 text-xs font-semibold tracking-[0.22em] text-slate-700 md:flex">
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            Smart Clinic Flow
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-white md:flex">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                                        <span className="text-xs uppercase tracking-[0.18em] text-slate-300">{user?.role}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="hidden items-center gap-3 md:flex">
                                <Link
                                    to="/login"
                                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Start with LexiMed
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsMenuOpen((current) => !current)}
                            className="rounded-full p-2 transition hover:bg-slate-100 md:hidden"
                        >
                            {isMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen ? (
                        <MotionDiv
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden"
                        >
                            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {isAuthenticated ? (
                                    <div className="rounded-3xl bg-slate-950 p-4 text-white">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{user?.name}</p>
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{user?.role}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={getDashboardLink()}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white"
                                    >
                                        Create Account
                                    </Link>
                                )}
                            </div>
                        </MotionDiv>
                    ) : null}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
