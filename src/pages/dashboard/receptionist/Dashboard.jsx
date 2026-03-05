import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
    Users, 
    Calendar, 
    UserPlus, 
    Search,
    Phone,
    Mail,
    MapPin,
    Edit2,
    Trash2,
    Clock,
    Stethoscope,
    Download,
    Filter,
    X,
    CheckCircle,
    XCircle,
    RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../../utils/helpers';
import { DashboardPage, DashboardTabs, Surface } from '../../../components/ui/AppShell';

const ReceptionistDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('patients');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);


    // Form states
    const [patientForm, setPatientForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: 'O+',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        emergencyContact: {
            name: '',
            relation: '',
            phone: ''
        }
    });

    const [appointmentForm, setAppointmentForm] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        symptoms: ''
    });

    useEffect(() => {
    fetchDoctors();  // 👈 Component load hote hi doctors fetch karo
}, []);

    useEffect(() => {
        if (activeTab === 'patients') {
            fetchPatients();
        } else if (activeTab === 'appointments') {
            fetchAppointments();
            fetchDoctors();
        }
    }, [activeTab]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/receptionist/patients');
            setPatients(response.data.patients || []);
        } catch {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/receptionist/appointments');
            setAppointments(response.data.appointments || []);
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
             const response = await api.get('/doctors/list');
        setDoctors(response.data.doctors || []);
        } catch {
            console.error('Failed to load doctors');
        }
    };

    const handleRegisterPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/receptionist/patients/register', patientForm);
            if (response.data.success) {
                toast.success('Patient registered successfully');
                setShowPatientModal(false);
                setPatientForm({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    dateOfBirth: '',
                    gender: 'Male',
                    bloodGroup: 'O+',
                    address: { street: '', city: '', state: '', pincode: '' },
                    emergencyContact: { name: '', relation: '', phone: '' }
                });
                fetchPatients();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put(`/receptionist/patients/${editingPatient._id}`, patientForm);
            if (response.data.success) {
                toast.success('Patient updated successfully');
                setShowPatientModal(false);
                setEditingPatient(null);
                fetchPatients();
            }
        } catch {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        fetchDoctors();
        setLoading(true);
        try {
            const response = await api.post('/receptionist/appointments/book', appointmentForm);
            if (response.data.success) {
                toast.success('Appointment booked successfully');
                setShowAppointmentModal(false);
                setAppointmentForm({
                    patientId: '',
                    doctorId: '',
                    date: '',
                    time: '',
                    symptoms: ''
                });
                fetchAppointments();
            }
        } catch {
            toast.error('Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            const response = await api.put(`/receptionist/appointments/${appointmentId}`, { status });
            if (response.data.success) {
                toast.success(`Appointment ${status}`);
                fetchAppointments();
            }
        } catch {
            toast.error('Failed to update appointment');
        }
    };

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
    );

    const tabs = [
        { id: 'patients', name: 'Patients', icon: Users },
        { id: 'appointments', name: 'Appointments', icon: Calendar },
        { id: 'schedule', name: 'Daily Schedule', icon: Clock },
    ];

    return (
        <DashboardPage
            eyebrow="Reception Desk"
            title="Front desk orchestration"
            description={`Handle registrations, appointment booking, and daily queue management with a cleaner LexiMed interface, ${user?.name || 'Receptionist'}.`}
        >

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                    onClick={() => {
                        setEditingPatient(null);
                        setPatientForm({
                            name: '',
                            email: '',
                            password: '',
                            phone: '',
                            dateOfBirth: '',
                            gender: 'Male',
                            bloodGroup: 'O+',
                            address: { street: '', city: '', state: '', pincode: '' },
                            emergencyContact: { name: '', relation: '', phone: '' }
                        });
                        setShowPatientModal(true);
                    }}
                    className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                    <UserPlus className="h-6 w-6" />
                    <span>Register New Patient</span>
                </button>
                
                <button
                    onClick={() => {
        fetchDoctors();  // 👈 Pehle doctors fetch karo
        setShowAppointmentModal(true);  // 👈 Phir modal open karo
    }}
                    className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                    <Calendar className="h-6 w-6" />
                    <span>Book Appointment</span>
                </button>
                
                <button
                    onClick={() => setActiveTab('schedule')}
                    className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2"
                >
                    <Clock className="h-6 w-6" />
                    <span>Today's Schedule</span>
                </button>
            </div>

            {/* Tabs */}
            <DashboardTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Search Bar (for patients tab) */}
            {activeTab === 'patients' && (
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Content Area */}
            <Surface className="p-6 sm:p-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Patients Tab */}
                        {activeTab === 'patients' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
                                {filteredPatients.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No patients found</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredPatients.map((patient) => (
                                                    <tr key={patient._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <Users className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                                    <div className="text-sm text-gray-500">ID: {patient._id.slice(-6)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">{patient.email}</div>
                                                            <div className="text-sm text-gray-500">{patient.phone}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                                {patient.patientDetails?.bloodGroup || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {formatDate(patient.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                patient.isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {patient.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPatient(patient);
                                                                    setPatientForm({
                                                                        name: patient.name,
                                                                        email: patient.email,
                                                                        password: '',
                                                                        phone: patient.phone || '',
                                                                        dateOfBirth: patient.patientDetails?.dateOfBirth || '',
                                                                        gender: patient.patientDetails?.gender || 'Male',
                                                                        bloodGroup: patient.patientDetails?.bloodGroup || 'O+',
                                                                        address: patient.patientDetails?.address || {
                                                                            street: '', city: '', state: '', pincode: ''
                                                                        },
                                                                        emergencyContact: patient.patientDetails?.emergencyContact || {
                                                                            name: '', relation: '', phone: ''
                                                                        }
                                                                    });
                                                                    setShowPatientModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                            >
                                                                <Edit2 className="h-4 w-4 inline" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Appointments Tab */}
                        {activeTab === 'appointments' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Appointment Management</h2>
                                {appointments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No appointments found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((apt) => (
                                            <div key={apt._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">{apt.patientId?.name}</h3>
                                                        <p className="text-sm text-gray-600">with Dr. {apt.doctorName}</p>
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
                                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {apt.status}
                                                        </span>
                                                        {apt.status === 'scheduled' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateAppointmentStatus(apt._id, 'completed')}
                                                                    className="text-green-600 hover:text-green-800"
                                                                    title="Mark Completed"
                                                                >
                                                                    <CheckCircle className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateAppointmentStatus(apt._id, 'cancelled')}
                                                                    className="text-red-600 hover:text-red-800"
                                                                    title="Cancel Appointment"
                                                                >
                                                                    <XCircle className="h-5 w-5" />
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

                        {/* Schedule Tab */}
                        {activeTab === 'schedule' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
                                {appointments.filter(apt => 
                                    new Date(apt.date).toDateString() === new Date().toDateString()
                                ).length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments
                                            .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString())
                                            .sort((a, b) => a.time.localeCompare(b.time))
                                            .map((apt) => (
                                                <div key={apt._id} className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="font-semibold">{apt.time} - {apt.patientId?.name}</p>
                                                            <p className="text-sm text-gray-600">Dr. {apt.doctorName}</p>
                                                            {apt.symptoms && (
                                                                <p className="text-sm text-gray-500 mt-1">Symptoms: {apt.symptoms}</p>
                                                            )}
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            apt.status === 'scheduled' ? 'bg-yellow-200 text-yellow-800' :
                                                            apt.status === 'completed' ? 'bg-green-200 text-green-800' : ''
                                                        }`}>
                                                            {apt.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </Surface>

            {/* Patient Registration/Edit Modal */}
            {showPatientModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">
                                    {editingPatient ? 'Edit Patient' : 'Register New Patient'}
                                </h2>
                                <button onClick={() => {
                                    setShowPatientModal(false);
                                    setEditingPatient(null);
                                }}>
                                    <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>

                            <form onSubmit={editingPatient ? handleUpdatePatient : handleRegisterPatient} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={patientForm.name}
                                            onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={patientForm.email}
                                            onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                            disabled={editingPatient}
                                        />
                                    </div>
                                </div>

                                {!editingPatient && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={patientForm.password}
                                            onChange={(e) => setPatientForm({...patientForm, password: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            value={patientForm.phone}
                                            onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={patientForm.dateOfBirth}
                                            onChange={(e) => setPatientForm({...patientForm, dateOfBirth: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                                        <select
                                            value={patientForm.gender}
                                            onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                        <select
                                            value={patientForm.bloodGroup}
                                            onChange={(e) => setPatientForm({...patientForm, bloodGroup: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        >
                                            <option>A+</option>
                                            <option>A-</option>
                                            <option>B+</option>
                                            <option>B-</option>
                                            <option>AB+</option>
                                            <option>AB-</option>
                                            <option>O+</option>
                                            <option>O-</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Address</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Street"
                                            value={patientForm.address.street}
                                            onChange={(e) => setPatientForm({
                                                ...patientForm, 
                                                address: {...patientForm.address, street: e.target.value}
                                            })}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={patientForm.address.city}
                                                onChange={(e) => setPatientForm({
                                                    ...patientForm, 
                                                    address: {...patientForm.address, city: e.target.value}
                                                })}
                                                className="p-2 border rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                placeholder="State"
                                                value={patientForm.address.state}
                                                onChange={(e) => setPatientForm({
                                                    ...patientForm, 
                                                    address: {...patientForm.address, state: e.target.value}
                                                })}
                                                className="p-2 border rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Pincode"
                                                value={patientForm.address.pincode}
                                                onChange={(e) => setPatientForm({
                                                    ...patientForm, 
                                                    address: {...patientForm.address, pincode: e.target.value}
                                                })}
                                                className="p-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Emergency Contact</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={patientForm.emergencyContact.name}
                                            onChange={(e) => setPatientForm({
                                                ...patientForm, 
                                                emergencyContact: {...patientForm.emergencyContact, name: e.target.value}
                                            })}
                                            className="p-2 border rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Relation"
                                            value={patientForm.emergencyContact.relation}
                                            onChange={(e) => setPatientForm({
                                                ...patientForm, 
                                                emergencyContact: {...patientForm.emergencyContact, relation: e.target.value}
                                            })}
                                            className="p-2 border rounded-lg"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={patientForm.emergencyContact.phone}
                                            onChange={(e) => setPatientForm({
                                                ...patientForm, 
                                                emergencyContact: {...patientForm.emergencyContact, phone: e.target.value}
                                            })}
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPatientModal(false);
                                            setEditingPatient(null);
                                        }}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : editingPatient ? 'Update Patient' : 'Register Patient'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Book Appointment</h2>
                                <button onClick={() => setShowAppointmentModal(false)}>
                                    <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>

                            <form onSubmit={handleBookAppointment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Patient</label>
                                    <select
                                        required
                                        value={appointmentForm.patientId}
                                        onChange={(e) => setAppointmentForm({...appointmentForm, patientId: e.target.value})}
                                        className="mt-1 w-full p-2 border rounded-lg"
                                    >
                                        <option value="">Choose patient</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                                    <select
                                        required
                                        value={appointmentForm.doctorId}
                                        onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: e.target.value})}
                                        className="mt-1 w-full p-2 border rounded-lg"
                                    >
                                        <option value="">Choose doctor</option>
                                        {doctors.map(d => (
                                            <option key={d._id} value={d._id}>Dr. {d.name} - {d.specialty}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={appointmentForm.date}
                                            onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={appointmentForm.time}
                                            onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                                            className="mt-1 w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                                    <textarea
                                        value={appointmentForm.symptoms}
                                        onChange={(e) => setAppointmentForm({...appointmentForm, symptoms: e.target.value})}
                                        rows="3"
                                        className="mt-1 w-full p-2 border rounded-lg"
                                        placeholder="Describe symptoms or reason for visit"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAppointmentModal(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Booking...' : 'Book Appointment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardPage>
    );
};

export default ReceptionistDashboard;
