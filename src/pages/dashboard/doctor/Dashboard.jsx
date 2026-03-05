import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
import api from '../../../utils/api';
import { 
    Calendar, 
    Users, 
    FileText, 
    Activity,
    Clock,
    TrendingUp,
    User,
    Phone,
    Mail,
    MapPin,
    Download,
    Plus,
    X,
    Brain,
    ChevronRight,
    BarChart3,
    Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../../utils/helpers';
import { DashboardPage, DashboardTabs, Surface } from '../../../components/ui/AppShell';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);

    // Schedule state - ✅ ADDED
    const [schedule, setSchedule] = useState({
        availableDays: [],
        availableTimeSlots: []
    });
    const [savingSchedule, setSavingSchedule] = useState(false);

    // Prescription form
    const [prescriptionForm, setPrescriptionForm] = useState({
        diagnosis: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        tests: [],
        notes: ''
    });

    // Prepare chart data from analytics
const getMonthlyData = () => {
    if (!analytics?.monthlyData) return [];
    return analytics.monthlyData.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
        appointments: item.count || 0
    }));
};

const getStatusData = () => [
    { name: 'Completed', value: analytics?.overview?.completedAppointments || 0 },
    { name: 'Pending', value: analytics?.overview?.pendingAppointments || 0 },
    { name: 'Cancelled', value: analytics?.overview?.cancelledAppointments || 0 }
];

    useEffect(() => {
        if (activeTab === 'appointments') {
            fetchAppointments();
        } else if (activeTab === 'analytics') {
            fetchAnalytics();
        }
    }, [activeTab]);

    // ✅ Fetch schedule on mount
    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/doctors/appointments');
            setAppointments(response.data.appointments || []);
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientHistory = async (patientId) => {
        try {
            const response = await api.get(`/doctors/patients/${patientId}/history`);
            setPatientHistory(response.data);
            setSelectedPatient(patientId);
        } catch {
            toast.error('Failed to load patient history');
        }
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/doctors/analytics');
            setAnalytics(response.data.analytics);
        } catch {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Schedule functions
    const fetchSchedule = async () => {
        try {
            const response = await api.get('/doctors/availability');
            setSchedule({
                availableDays: response.data.availableDays || [],
                availableTimeSlots: response.data.availableTimeSlots || []
            });
        } catch {
            toast.error('Failed to load schedule');
        }
    };

    const saveSchedule = async () => {
        setSavingSchedule(true);
        try {
            const response = await api.put('/doctors/availability', schedule);
            if (response.data.success) {
                toast.success('Schedule saved successfully');
            }
        } catch {
            toast.error('Failed to save schedule');
        } finally {
            setSavingSchedule(false);
        }
    };

    const handleCompleteAppointment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(
                `/doctors/appointments/${selectedAppointment._id}/complete`,
                prescriptionForm
            );
            if (response.data.success) {
                toast.success('Appointment completed & prescription saved');
                setShowPrescriptionModal(false);
                setPrescriptionForm({
                    diagnosis: '',
                    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
                    tests: [],
                    notes: ''
                });
                fetchAppointments();
            }
        } catch {
            toast.error('Failed to complete appointment');
        } finally {
            setLoading(false);
        }
    };

    const addMedicine = () => {
        setPrescriptionForm({
            ...prescriptionForm,
            medicines: [
                ...prescriptionForm.medicines,
                { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
            ]
        });
    };

    const removeMedicine = (index) => {
        const medicines = [...prescriptionForm.medicines];
        medicines.splice(index, 1);
        setPrescriptionForm({ ...prescriptionForm, medicines });
    };

    const updateMedicine = (index, field, value) => {
        const medicines = [...prescriptionForm.medicines];
        medicines[index][field] = value;
        setPrescriptionForm({ ...prescriptionForm, medicines });
    };

    const getAiSuggestion = async () => {
        if (!prescriptionForm.diagnosis) {
            toast.error('Please enter diagnosis first');
            return;
        }
        setLoadingAI(true);
        try {
            const response = await api.post('/gemini/suggest-treatment', {
                diagnosis: prescriptionForm.diagnosis,
                symptoms: selectedAppointment?.symptoms
            });
            setAiSuggestion(response.data.suggestion);
        } catch {
            toast.error('Failed to get AI suggestion');
        } finally {
            setLoadingAI(false);
        }
    };

    const tabs = [
        { id: 'appointments', name: 'Appointments', icon: Calendar },
        { id: 'patients', name: 'My Patients', icon: Users },
        { id: 'analytics', name: 'Analytics', icon: BarChart3 },
        { id: 'schedule', name: 'Schedule', icon: Clock }
    ];

    return (
        <DashboardPage
            eyebrow="Doctor Workspace"
            title="Clinical flow, simplified"
            description={`Manage appointments, patient context, and AI-assisted prescriptions in a more refined workspace, Dr. ${user?.name || ''}.`}
        >

            <DashboardTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <Surface className="p-6 sm:p-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Appointments Tab */}
                        {activeTab === 'appointments' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
                                {appointments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((apt) => (
                                            <div key={apt._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{apt.patientId?.name}</h3>
                                                        <p className="text-sm text-gray-600">Patient ID: {apt.patientId?._id.slice(-6)}</p>
                                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                            <span>📅 {formatDate(apt.date)}</span>
                                                            <span>⏰ {apt.time}</span>
                                                            {apt.symptoms && <span>💊 {apt.symptoms}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            apt.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {apt.status}
                                                        </span>
                                                        {apt.status === 'scheduled' && (
                                                            <>
                                                                <button
                                                                    onClick={() => fetchPatientHistory(apt.patientId._id)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="View History"
                                                                >
                                                                    <Users className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedAppointment(apt);
                                                                        setShowPrescriptionModal(true);
                                                                    }}
                                                                    className="text-green-600 hover:text-green-800"
                                                                    title="Complete Appointment"
                                                                >
                                                                    <FileText className="h-5 w-5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analytics Tab */}
{activeTab === 'analytics' && analytics && (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Analytics</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Patients</p>
                        <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalPatients}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Appointments</p>
                        <p className="text-2xl font-bold text-green-600">{analytics.overview.totalAppointments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{analytics.overview.completionRate}%</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{analytics.overview.pendingAppointments}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                </div>
            </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bar Chart - Monthly Appointments */}
            <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Monthly Appointments Trend
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getMonthlyData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="appointments" fill="#3B82F6" name="Appointments" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart - Appointment Status Distribution */}
            <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    Appointment Status Distribution
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={getStatusData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {getStatusData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line Chart - Weekly Trend (Optional) */}
            <div className="bg-white border rounded-lg p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Avg. per day</p>
                        <p className="text-2xl font-bold text-green-800">
                            {(analytics.overview.totalAppointments / 30).toFixed(1)}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">New patients</p>
                        <p className="text-2xl font-bold text-blue-800">{analytics.overview.totalPatients}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-purple-800">{analytics.overview.completionRate}%</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
            </h3>
            <div className="space-y-3">
                {appointments.slice(0, 5).map(apt => (
                    <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                            <p className="font-medium text-gray-800">{apt.patientId?.name}</p>
                            <p className="text-sm text-gray-500">
                                {formatDate(apt.date)} at {apt.time}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {apt.status}
                        </span>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent appointments</p>
                )}
            </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-3">📈 Performance</h4>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-indigo-700">Completion Rate</span>
                        <span className="font-bold text-indigo-900">{analytics.overview.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-indigo-700">Cancelled</span>
                        <span className="font-bold text-indigo-900">{analytics.overview.cancelledAppointments || 0}</span>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-3">⏱️ Quick Stats</h4>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-amber-700">Avg. per day</span>
                        <span className="font-bold text-amber-900">
                            {(analytics.overview.totalAppointments / 30).toFixed(1)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-amber-700">New patients</span>
                        <span className="font-bold text-amber-900">{analytics.overview.totalPatients}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

                        {/* Schedule Tab */}
                        {activeTab === 'schedule' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">Manage Your Schedule</h2>
                                    <button
                                        onClick={saveSchedule}
                                        disabled={savingSchedule}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {savingSchedule ? 'Saving...' : 'Save Schedule'}
                                    </button>
                                </div>

                                {/* Working Days */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Working Days</h3>
                                    <div className="grid grid-cols-7 gap-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                            <label key={day} className="flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={schedule.availableDays.includes(day)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSchedule({
                                                                ...schedule,
                                                                availableDays: [...schedule.availableDays, day]
                                                            });
                                                        } else {
                                                            setSchedule({
                                                                ...schedule,
                                                                availableDays: schedule.availableDays.filter(d => d !== day)
                                                            });
                                                        }
                                                    }}
                                                    className="mb-2"
                                                />
                                                <span className="text-sm">{day.slice(0, 3)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Time Slots</h3>
                                    
                                    {schedule.availableTimeSlots.map((slot, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                                            <div className="col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Day</label>
                                                <select
                                                    value={slot.day}
                                                    onChange={(e) => {
                                                        const newSlots = [...schedule.availableTimeSlots];
                                                        newSlots[index].day = e.target.value;
                                                        setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                    }}
                                                    className="w-full p-2 border rounded-lg"
                                                >
                                                    {schedule.availableDays.map(day => (
                                                        <option key={day} value={day}>{day}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => {
                                                        const newSlots = [...schedule.availableTimeSlots];
                                                        newSlots[index].startTime = e.target.value;
                                                        setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                    }}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">End Time</label>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => {
                                                        const newSlots = [...schedule.availableTimeSlots];
                                                        newSlots[index].endTime = e.target.value;
                                                        setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                    }}
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Duration (min)</label>
                                                <select
                                                    value={slot.slotDuration}
                                                    onChange={(e) => {
                                                        const newSlots = [...schedule.availableTimeSlots];
                                                        newSlots[index].slotDuration = parseInt(e.target.value);
                                                        setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                    }}
                                                    className="w-full p-2 border rounded-lg"
                                                >
                                                    <option value="15">15 min</option>
                                                    <option value="30">30 min</option>
                                                    <option value="45">45 min</option>
                                                    <option value="60">60 min</option>
                                                </select>
                                            </div>
                                            <div className="col-span-3 flex items-center space-x-2">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={slot.isAvailable}
                                                        onChange={(e) => {
                                                            const newSlots = [...schedule.availableTimeSlots];
                                                            newSlots[index].isAvailable = e.target.checked;
                                                            setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                        }}
                                                    />
                                                    <span className="text-sm">Available</span>
                                                </label>
                                                {schedule.availableTimeSlots.length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            const newSlots = schedule.availableTimeSlots.filter((_, i) => i !== index);
                                                            setSchedule({ ...schedule, availableTimeSlots: newSlots });
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setSchedule({
                                                ...schedule,
                                                availableTimeSlots: [
                                                    ...schedule.availableTimeSlots,
                                                    {
                                                        day: schedule.availableDays[0] || 'Monday',
                                                        startTime: '09:00',
                                                        endTime: '17:00',
                                                        slotDuration: 30,
                                                        isAvailable: true
                                                    }
                                                ]
                                            });
                                        }}
                                        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <Plus className="h-5 w-5 mr-1" /> Add Time Slot
                                    </button>
                                </div>

                                {/* Summary Preview */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-blue-800">Schedule Preview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {schedule.availableDays.map(day => {
                                            const daySlots = schedule.availableTimeSlots.filter(s => s.day === day);
                                            return (
                                                <div key={day} className="bg-white p-3 rounded-lg">
                                                    <p className="font-medium text-gray-800 mb-2">{day}</p>
                                                    {daySlots.length > 0 ? (
                                                        daySlots.map((slot, i) => (
                                                            <p key={i} className="text-sm text-gray-600">
                                                                {slot.startTime} - {slot.endTime} ({slot.slotDuration} min) 
                                                                {slot.isAvailable ? ' ✅' : ' ❌'}
                                                            </p>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-400">No slots set</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Patient History Modal */}
                        {selectedPatient && patientHistory && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-bold">Patient History</h2>
                                            <button onClick={() => setSelectedPatient(null)}>
                                                <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                                            </button>
                                        </div>

                                        {/* Patient Info */}
                                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                            <h3 className="font-semibold mb-2">{patientHistory.patient.name}</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>Email: {patientHistory.patient.email}</div>
                                                <div>Phone: {patientHistory.patient.phone}</div>
                                                {patientHistory.patient.details && (
                                                    <>
                                                        <div>Blood Group: {patientHistory.patient.details.bloodGroup}</div>
                                                        <div>Gender: {patientHistory.patient.details.gender}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Past Appointments */}
                                        <h3 className="font-semibold mb-2">Past Appointments</h3>
                                        <div className="space-y-2 mb-6">
                                            {patientHistory.appointments.map((apt) => (
                                                <div key={apt._id} className="border p-3 rounded">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="text-sm">📅 {formatDate(apt.date)} at {apt.time}</p>
                                                            <p className="text-xs text-gray-500">Symptoms: {apt.symptoms}</p>
                                                        </div>
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            {apt.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Past Prescriptions */}
                                        <h3 className="font-semibold mb-2">Past Prescriptions</h3>
                                        <div className="space-y-3">
                                            {patientHistory.prescriptions.map((pres) => (
                                                <div key={pres._id} className="border p-3 rounded bg-gray-50">
                                                    <p className="font-medium">{formatDate(pres.date)}</p>
                                                    <p className="text-sm mt-1">Diagnosis: {pres.diagnosis}</p>
                                                    <p className="text-xs text-gray-600 mt-1">Medicines:</p>
                                                    <ul className="list-disc list-inside text-xs">
                                                        {pres.medicines.map((med, idx) => (
                                                            <li key={idx}>{med.name} - {med.dosage} - {med.frequency} for {med.duration}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Prescription Modal */}
                        {showPrescriptionModal && selectedAppointment && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-bold">Complete Appointment</h2>
                                            <button onClick={() => setShowPrescriptionModal(false)}>
                                                <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                                            </button>
                                        </div>

                                        {/* Patient Info */}
                                        <div className="bg-blue-50 p-3 rounded mb-4">
                                            <p className="font-medium">{selectedAppointment.patientId?.name}</p>
                                            <p className="text-sm text-gray-600">Symptoms: {selectedAppointment.symptoms}</p>
                                        </div>

                                        {/* AI Assistant Button */}
                                        <div className="mb-4">
                                            <button
                                                onClick={getAiSuggestion}
                                                disabled={loadingAI}
                                                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800"
                                            >
                                                <Brain className="h-5 w-5" />
                                                <span>{loadingAI ? 'Getting AI suggestion...' : 'Get AI treatment suggestion'}</span>
                                            </button>
                                            {aiSuggestion && (
                                                <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
                                                    <p className="font-medium text-purple-800 mb-1">AI Suggestion:</p>
                                                    <p className="text-gray-700">{aiSuggestion}</p>
                                                </div>
                                            )}
                                        </div>

                                        <form onSubmit={handleCompleteAppointment} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={prescriptionForm.diagnosis}
                                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                                                    className="mt-1 w-full p-2 border rounded-lg"
                                                    placeholder="Enter diagnosis"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                                                {prescriptionForm.medicines.map((med, index) => (
                                                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Medicine name"
                                                            value={med.name}
                                                            onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                                            className="col-span-3 p-2 border rounded-lg text-sm"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Dosage"
                                                            value={med.dosage}
                                                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                                            className="col-span-2 p-2 border rounded-lg text-sm"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Frequency"
                                                            value={med.frequency}
                                                            onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                                            className="col-span-2 p-2 border rounded-lg text-sm"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Duration"
                                                            value={med.duration}
                                                            onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                                            className="col-span-2 p-2 border rounded-lg text-sm"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Instructions"
                                                            value={med.instructions}
                                                            onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                                            className="col-span-2 p-2 border rounded-lg text-sm"
                                                        />
                                                        {prescriptionForm.medicines.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMedicine(index)}
                                                                className="col-span-1 text-red-600 hover:text-red-800"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addMedicine}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" /> Add Medicine
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Notes</label>
                                                <textarea
                                                    value={prescriptionForm.notes}
                                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                                                    rows="3"
                                                    className="mt-1 w-full p-2 border rounded-lg"
                                                    placeholder="Additional instructions, follow-up notes..."
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPrescriptionModal(false)}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : 'Complete Appointment'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Surface>
        </DashboardPage>
    );
};

export default DoctorDashboard;
