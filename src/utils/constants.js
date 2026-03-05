// User roles
export const ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    RECEPTIONIST: 'receptionist'
};

// Role display names
export const ROLE_NAMES = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.DOCTOR]: 'Doctor',
    [ROLES.PATIENT]: 'Patient',
    [ROLES.RECEPTIONIST]: 'Receptionist'
};

// Appointment status
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    RESCHEDULED: 'rescheduled'
};

// Payment status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed'
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: {
        [ROLES.ADMIN]: '/dashboard/admin',
        [ROLES.DOCTOR]: '/dashboard/doctor',
        [ROLES.PATIENT]: '/dashboard/patient',
        [ROLES.RECEPTIONIST]: '/dashboard/receptionist'
    }
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme'
};

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me'
    },
    DOCTORS: '/doctors',
    PATIENTS: '/patients',
    APPOINTMENTS: '/appointments',
    PRESCRIPTIONS: '/prescriptions'
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    PAGE_SIZES: [10, 20, 50, 100]
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'DD MMM YYYY',
    DISPLAY_TIME: 'DD MMM YYYY, hh:mm A',
    API: 'YYYY-MM-DD',
    API_TIME: 'YYYY-MM-DD HH:mm:ss'
};

// App info
export const APP_INFO = {
    NAME: 'AI Clinic Management',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-Powered Healthcare Management System'
};