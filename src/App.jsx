import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/dashboard/patient/Dashboard';
import DoctorDashboard from './pages/dashboard/doctor/Dashboard';
import AdminDashboard from './pages/dashboard/admin/Dashboard';
import ReceptionistDashboard from './pages/dashboard/receptionist/Dashboard';
import Unauthorized from './pages/Unauthorized';

const theme = createTheme({
    palette: {
        primary: { main: '#0f766e' },
        secondary: { main: '#f97316' },
        background: { default: '#f8fbfa' },
    },
    shape: { borderRadius: 24 },
    typography: {
        fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
        h1: { fontFamily: '"Georgia", "Times New Roman", serif' },
        h2: { fontFamily: '"Georgia", "Times New Roman", serif' },
        h3: { fontFamily: '"Georgia", "Times New Roman", serif' },
    },
});

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="min-h-screen">
                        <Navbar />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3200,
                                style: {
                                    borderRadius: '18px',
                                    padding: '14px 16px',
                                    background: 'rgba(15, 23, 42, 0.94)',
                                    color: '#f8fafc',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 18px 48px rgba(15,23,42,0.24)',
                                },
                                success: { iconTheme: { primary: '#14b8a6', secondary: '#ecfeff' } },
                                error: { iconTheme: { primary: '#fb7185', secondary: '#fff1f2' } },
                            }}
                        />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route
                                    path="/dashboard/patient"
                                    element={
                                        <ProtectedRoute allowedRoles={['patient']}>
                                            <PatientDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/doctor"
                                    element={
                                        <ProtectedRoute allowedRoles={['doctor']}>
                                            <DoctorDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/admin"
                                    element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/receptionist"
                                    element={
                                        <ProtectedRoute allowedRoles={['receptionist']}>
                                            <ReceptionistDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </main>
                    </div>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
