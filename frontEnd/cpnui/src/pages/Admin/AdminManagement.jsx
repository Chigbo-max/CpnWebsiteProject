import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';

const AdminManagement = ({ token, currentAdmin }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', admin: null });


  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;


  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (!currentAdmin || currentAdmin.role !== 'superadmin') {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only high-privileged admins can manage other admins.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    setConfirmModal({ open: true, type: 'delete', admin: admins.find(a => (a.id || a._id) === id) });
  };

  const handleResetPassword = async (id) => {
    setConfirmModal({ open: true, type: 'reset', admin: admins.find(a => (a.id || a._id) === id) });
  };

  const confirmAction = async () => {
    if (!confirmModal.admin) return;
    if (confirmModal.type === 'delete') {
      try {
        const res = await fetch(`${apiBaseUrl}/api/admin/admins/${confirmModal.admin.id || confirmModal.admin._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete admin');
        toast.success('Admin deleted');
        fetchAdmins();
      } catch (err) {
        toast.error(err.message);
      }
    } else if (confirmModal.type === 'reset') {
      try {
        const res = await fetch(`${apiBaseUrl}/api/admin/admins/${confirmModal.admin.id || confirmModal.admin._id}/reset-password`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to reset password');
        toast.success('Password reset. Email sent.');
      } catch (err) {
        toast.error(err.message);
      }
    }
    setConfirmModal({ open: false, type: '', admin: null });
  };

  const closeConfirmModal = () => setConfirmModal({ open: false, type: '', admin: null });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add admin');
      toast.success('Admin added');
      setModalOpen(false);
      setForm({ username: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <button
          className="px-4 py-2 rounded bg-amber-500 text-white font-semibold hover:bg-amber-600"
          onClick={() => setModalOpen(true)}
        >
          Add Admin
        </button>
      </div>
      {loading ? (
        <SimpleSpinner message="Loading admins..." />
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No admins found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map(admin => (
                <tr key={admin.id || admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{admin.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {currentAdmin && (admin.id || admin._id) !== currentAdmin.id && (
                      <>
                        <button
                          className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                          onClick={() => handleDelete(admin.id || admin._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                          onClick={() => handleResetPassword(admin.id || admin._id)}
                        >
                          Reset Password
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for adding admin */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Admin'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={closeConfirmModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {confirmModal.type === 'delete' ? 'Confirm Delete' : 'Confirm Password Reset'}
            </h2>
            <p className="mb-6">
              {confirmModal.type === 'delete'
                ? `Are you sure you want to delete admin "${confirmModal.admin?.username}"? This action cannot be undone.`
                : `Are you sure you want to reset the password for admin "${confirmModal.admin?.username}"?`}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white font-semibold ${confirmModal.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
                onClick={confirmAction}
              >
                {confirmModal.type === 'delete' ? 'Delete' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AdminManagement.propTypes = {
  currentAdmin: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default AdminManagement; 