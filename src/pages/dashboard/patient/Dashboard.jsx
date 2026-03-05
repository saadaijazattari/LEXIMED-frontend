import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { Calendar, FileText, User, Download, Brain, Clock, Activity } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';
import toast from 'react-hot-toast';
import { DashboardPage, DashboardTabs, Surface } from '../../../components/ui/AppShell';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [aiExplanation, setAiExplanation] = useState('');

    // Fetch appointments on mount
    useEffect(() => {
        if (activeTab === 'appointments') {
            fetchAppointments();
        } else if (activeTab === 'prescriptions') {
            fetchPrescriptions();
        }
    }, [activeTab]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/patients/appointments');
            setAppointments(response.data.appointments || []);
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/patients/prescriptions');
            setPrescriptions(response.data.prescriptions || []);
        } catch {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const downloadPrescription = async (prescriptionId) => {
        try {
            const response = await api.get(`/patients/prescriptions/${prescriptionId}/pdf`, {
                responseType: 'blob'
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription-${prescriptionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Prescription downloaded');
        } catch {
            toast.error('Failed to download prescription');
        }
    };

const getAiExplanation = async (prescriptionId) => {
    try {
        setSelectedPrescription(prescriptionId);
        setLoading(true);
        
        // Gemini API call
        const response = await api.post('/gemini/explain-prescription', {
            prescriptionId
        });
        
        setAiExplanation(response.data.explanation);
    } catch (error) {
        toast.error('Failed to get AI explanation');
        console.error('AI Error:', error);
    } finally {
        setLoading(false);
    }
};
    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'appointments', name: 'Appointments', icon: Calendar },
        { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
    ];

    return (
        <DashboardPage
            eyebrow="Patient Workspace"
            title="Your care timeline"
            description={`Track prescriptions, review appointments, and stay informed with a cleaner LexiMed experience, ${user?.name || 'Patient'}.`}
        >

            <DashboardTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <Surface className="p-6 sm:p-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Full Name</label>
                                        <p className="text-lg font-medium">{user?.name}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Email</label>
                                        <p className="text-lg font-medium">{user?.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Phone</label>
                                        <p className="text-lg font-medium">{user?.phone || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-sm text-gray-500">Member Since</label>
                                        <p className="text-lg font-medium">
                                            {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appointments Tab */}
                        {activeTab === 'appointments' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
                                {appointments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No appointments found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((apt) => (
                                            <div key={apt._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">Dr. {apt.doctorName}</h3>
                                                        <p className="text-sm text-gray-600">{apt.specialty}</p>
                                                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(apt.date)}</span>
                                                            <Clock className="h-4 w-4 ml-2" />
                                                            <span>{apt.time}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
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

                        {/* Prescriptions Tab */}
                        {activeTab === 'prescriptions' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">My Prescriptions</h2>
                                {prescriptions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No prescriptions found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {prescriptions.map((pres) => (
                                            <div key={pres._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">Dr. {pres.doctorName}</h3>
                                                        <p className="text-sm text-gray-600">{pres.diagnosis}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatDate(pres.date)}</p>
                                                        
                                                        {/* Medicines List */}
                                                        <div className="mt-3">
                                                            <p className="text-sm font-medium">Medicines:</p>
                                                            <ul className="list-disc list-inside text-sm text-gray-600">
                                                                {pres.medicines?.map((med, idx) => (
                                                                    <li key={idx}>{med.name} - {med.dosage} for {med.duration}</li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* AI Explanation */}
                                                        {selectedPrescription === pres._id && aiExplanation && (
                                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                                <div className="flex items-start space-x-2">
                                                                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                                                                    <div>
                                                                        <p className="font-medium text-blue-800">AI Explanation</p>
                                                                        <p className="text-sm text-gray-700">{aiExplanation}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        <button
                                                            onClick={() => downloadPrescription(pres._id)}
                                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            <span className="text-sm">PDF</span>
                                                        </button>
                                                        <button
                                                            onClick={() => getAiExplanation(pres._id)}
                                                            className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                                                        >
                                                            <Brain className="h-4 w-4" />
                                                            <span className="text-sm">Explain</span>
                                                        </button>
                                                    </div>
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
        </DashboardPage>
    );
};

export default PatientDashboard;
