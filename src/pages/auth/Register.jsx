import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/ui/AuthLayout';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        const { confirmPassword: _confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            toast.success('Registration successful!');
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
            toast.error(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <AuthLayout
            title="Create your LexiMed account"
            subtitle="Open a polished workspace for patients, doctors, admins, or reception teams."
            points={['Better wording and cleaner interactions across the app', 'Focused navigation without broken placeholder routes', 'Modern motion, icons, and consistent role-specific styling']}
            alternateText="Already onboarded?"
            alternateLabel="Sign in"
            alternateTo="/login"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Full Name" icon={User}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        placeholder="John Doe"
                    />
                </Field>

                <Field label="Email Address" icon={Mail}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        placeholder="john@example.com"
                    />
                </Field>

                <Field label="Phone Number" icon={Phone}>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        placeholder="+92 300 1234567"
                    />
                </Field>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Register as</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <Field label="Password" icon={Lock}>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        placeholder="Minimum 6 characters"
                    />
                </Field>

                <Field label="Confirm Password" icon={Lock}>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-12 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        placeholder="Re-enter your password"
                    />
                </Field>

                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 px-4 font-semibold text-white transition ${
                        loading ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-950 hover:bg-slate-800'
                    }`}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
            </form>
        </AuthLayout>
    );
};

const Field = ({ label, icon, children }) => {
    const IconComponent = icon;
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <IconComponent className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                {children}
            </div>
        </div>
    );
};

export default Register;
