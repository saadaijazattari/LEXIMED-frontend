import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  Activity,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  BarChart3,
  Loader2,
  Plus,
  Edit,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/helpers";
import { DashboardPage, DashboardTabs, Surface } from "../../../components/ui/AppShell";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("doctors");

  // Doctors state
  const [doctors, setDoctors] = useState([]);

  // Receptionists state
  const [receptionists, setReceptionists] = useState([]);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [showReceptionistModal, setShowReceptionistModal] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);

  // Tab configuration
  const tabs = [
    { id: "doctors", name: "Doctors", icon: Users },
    { id: "receptionists", name: "Receptionists", icon: UserCheck },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
  ];

  // useEffect to fetch data based on active tab
  useEffect(() => {
    if (activeTab === "doctors") {
      fetchDoctors();
    } else if (activeTab === "receptionists") {
      fetchReceptionists();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/doctors");
      setDoctors(response.data.doctors || []);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch receptionists
  const fetchReceptionists = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/receptionists");
      setReceptionists(response.data.receptionists || []);
    } catch {
      toast.error("Failed to load receptionists");
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/analytics");
      setAnalytics(response.data.analytics);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Doctor handlers
  const handleVerifyDoctor = async (doctorId, isVerified) => {
    try {
      const response = await api.put(`/admin/doctors/${doctorId}/verify`, {
        isVerified,
      });
      if (response.data.success) {
        toast.success(
          `Doctor ${isVerified ? "approved" : "rejected"} successfully`,
        );
        fetchDoctors();
      }
    } catch {
      toast.error("Failed to update doctor status");
    }
  };

  const handleToggleDoctorStatus = async (doctorId) => {
    try {
      const response = await api.put(
        `/admin/doctors/${doctorId}/toggle-status`,
      );
      if (response.data.success) {
        toast.success(
          `Doctor ${response.data.isActive ? "activated" : "deactivated"}`,
        );
        fetchDoctors();
      }
    } catch {
      toast.error("Failed to toggle doctor status");
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await api.delete(`/admin/doctors/${doctorId}`);
      if (response.data.success) {
        toast.success("Doctor deleted successfully");
        fetchDoctors();
      }
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  // Receptionist handlers
  const handleAddReceptionist = async (formData) => {
    try {
      const response = await api.post("/admin/receptionists", formData);
      if (response.data.success) {
        toast.success("Receptionist added successfully");
        setShowReceptionistModal(false);
        fetchReceptionists();
      }
    } catch {
      toast.error("Failed to add receptionist");
    }
  };

  const handleEditReceptionist = (rec) => {
    setSelectedReceptionist(rec);
    setShowReceptionistModal(true);
  };

  const handleUpdateReceptionist = async (formData) => {
    try {
      const response = await api.put(
        `/admin/receptionists/${selectedReceptionist._id}`,
        formData,
      );
      if (response.data.success) {
        toast.success("Receptionist updated successfully");
        setShowReceptionistModal(false);
        setSelectedReceptionist(null);
        fetchReceptionists();
      }
    } catch {
      toast.error("Failed to update receptionist");
    }
  };

  const handleToggleReceptionistStatus = async (recId) => {
    try {
      const response = await api.put(
        `/admin/receptionists/${recId}/toggle-status`,
      );
      if (response.data.success) {
        toast.success(
          `Receptionist ${response.data.isActive ? "activated" : "deactivated"}`,
        );
        fetchReceptionists();
      }
    } catch {
      toast.error("Failed to toggle receptionist status");
    }
  };

  const handleDeleteReceptionist = async (recId) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?"))
      return;

    try {
      const response = await api.delete(`/admin/receptionists/${recId}`);
      if (response.data.success) {
        toast.success("Receptionist deleted successfully");
        fetchReceptionists();
      }
    } catch {
      toast.error("Failed to delete receptionist");
    }
  };

  // Receptionist Modal Component
  const ReceptionistModal = ({
    isOpen,
    onClose,
    receptionist,
    onAdd,
    onUpdate,
  }) => {
    const [formData, setFormData] = useState({
      name: receptionist?.name || "",
      email: receptionist?.email || "",
      phone: receptionist?.phone || "",
      password: "",
      isActive: receptionist?.isActive ?? true,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (receptionist) {
        await onUpdate(formData);
      } else {
        await onAdd(formData);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-4">
            {receptionist ? "Edit Receptionist" : "Add Receptionist"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded-lg"
                disabled={!!receptionist}
              />
            </div>
            {!receptionist && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {receptionist ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <DashboardPage
      eyebrow="Admin Workspace"
      title="Clinic control room"
      description={`Oversee verification, staffing, and platform health with a more focused LexiMed admin dashboard, ${user?.name || 'Admin'}.`}
    >

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-800">
                  {analytics.users.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-blue-600">
              <span>{analytics.users.doctors} doctors</span> ·
              <span>{analytics.users.patients} patients</span> ·
              <span>{analytics.users.receptionists} receptionists</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Appointments</p>
                <p className="text-3xl font-bold text-green-800">
                  {analytics.appointments.total}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-green-600">
              <span>{analytics.appointments.completed} completed</span> ·
              <span>{analytics.appointments.pending} pending</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-purple-800">
                  {
                    doctors.filter((d) => d.details?.isVerified === false)
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 mb-1">Active Doctors</p>
                <p className="text-3xl font-bold text-amber-800">
                  {doctors.filter((d) => d.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <DashboardTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <Surface className="p-6 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Doctors Tab */}
            {activeTab === "doctors" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Doctors</h2>
                  <span className="text-sm text-gray-500">
                    {doctors.length} doctors total
                  </span>
                </div>

                {doctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No doctors found
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Doctor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Specialty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Experience
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Fee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Verified
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                          <tr key={doctor._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {doctor.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {doctor.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {doctor.details?.specialty || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {doctor.details?.experience || 0} years
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ₹{doctor.details?.consultationFee || 0}
                            </td>
                            <td className="px-6 py-4">
                              {doctor.details?.isVerified ? (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  doctor.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {doctor.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {!doctor.details?.isVerified && (
                                  <button
                                    onClick={() =>
                                      handleVerifyDoctor(doctor._id, true)
                                    }
                                    className="text-green-600 hover:text-green-800"
                                    title="Approve"
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </button>
                                )}
                                {doctor.details?.isVerified && (
                                  <button
                                    onClick={() =>
                                      handleVerifyDoctor(doctor._id, false)
                                    }
                                    className="text-yellow-600 hover:text-yellow-800"
                                    title="Reject"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleToggleDoctorStatus(doctor._id)
                                  }
                                  className={`${
                                    doctor.isActive
                                      ? "text-red-600 hover:text-red-800"
                                      : "text-green-600 hover:text-green-800"
                                  }`}
                                  title={
                                    doctor.isActive ? "Deactivate" : "Activate"
                                  }
                                >
                                  {doctor.isActive ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteDoctor(doctor._id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && analytics && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Platform Analytics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Users Chart */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                      Users Distribution
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Doctors</span>
                        <span className="font-semibold">
                          {analytics.users.doctors}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.users.doctors / analytics.users.total) * 100}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-gray-600">Patients</span>
                        <span className="font-semibold">
                          {analytics.users.patients}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.users.patients / analytics.users.total) * 100}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-gray-600">Receptionists</span>
                        <span className="font-semibold">
                          {analytics.users.receptionists}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(analytics.users.receptionists / analytics.users.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Appointments Stats */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">
                      Appointments Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">
                          Total Appointments
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {analytics.appointments.total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Completed</span>
                        <span className="text-2xl font-bold text-green-600">
                          {analytics.appointments.completed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Pending</span>
                        <span className="text-2xl font-bold text-yellow-600">
                          {analytics.appointments.pending}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {analytics.appointments.total > 0
                            ? (
                                (analytics.appointments.completed /
                                  analytics.appointments.total) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Receptionist Tab */}
            {activeTab === "receptionists" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    Manage Receptionists
                  </h2>
                  <button
                    onClick={() => setShowReceptionistModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Receptionist
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : receptionists.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No receptionists found
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {receptionists.map((rec) => (
                          <tr key={rec._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {rec.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {rec.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {rec.phone || "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  rec.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {rec.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {formatDate(rec.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditReceptionist(rec)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleToggleReceptionistStatus(rec._id)
                                  }
                                  className={`${
                                    rec.isActive
                                      ? "text-red-600 hover:text-red-800"
                                      : "text-green-600 hover:text-green-800"
                                  }`}
                                  title={
                                    rec.isActive ? "Deactivate" : "Activate"
                                  }
                                >
                                  {rec.isActive ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReceptionist(rec._id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Surface>

      {/* Receptionist Modal */}
      <ReceptionistModal
        isOpen={showReceptionistModal}
        onClose={() => {
          setShowReceptionistModal(false);
          setSelectedReceptionist(null);
        }}
        receptionist={selectedReceptionist}
        onAdd={handleAddReceptionist}
        onUpdate={handleUpdateReceptionist}
      />
    </DashboardPage>
  );
};

export default AdminDashboard;
