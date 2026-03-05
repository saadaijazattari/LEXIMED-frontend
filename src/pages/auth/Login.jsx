import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/ui/AuthLayout';

const Login = () => {
    const MotionDiv = motion.div;
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            toast.success('Login successful!');
            switch (result.role) {
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                case 'doctor':
                    navigate('/dashboard/doctor');
                    break;
                case 'receptionist':
                    navigate('/dashboard/receptionist');
                    break;
                default:
                    navigate('/dashboard/patient');
            }
        } else {
            toast.error(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to manage appointments, patients, and AI-assisted care flows."
            points={['Unified receptionist, doctor, patient, and admin access', 'Fast toast feedback for every auth action', 'Modern, calmer visual rhythm across every screen']}
            alternateText="Need a new account?"
            alternateLabel="Create one"
            alternateTo="/register"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                            placeholder="doctor@leximed.com"
                        />
                    </div>
                </MotionDiv>

                <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                            placeholder="Enter your password"
                        />
                    </div>
                </MotionDiv>

                <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                        loading ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-950 hover:bg-slate-800'
                    }`}
                >
                    <span>{loading ? 'Signing in...' : 'Sign In to LexiMed'}</span>
                    {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
