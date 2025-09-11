import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import {
  useGetAdminsQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
  useResetAdminPasswordMutation,
} from '../../features/admin/adminManagementApi';

const AdminManagement = ({ currentAdmin }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'admin' 
  });
  const [confirmModal, setConfirmModal] = useState({ 
    open: false, 
    type: '', 
    admin: null 
  });

  // RTK Query hooks
  const { 
    data: admins = [], 
    isLoading, 
    isError, 
    error 
  } = useGetAdminsQuery(undefined, {
    skip: !currentAdmin || currentAdmin.role !== 'superadmin',
  });

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.username?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.role?.toLowerCase().includes(searchLower) ||
      admin._id?.toString().includes(searchLower)
    );
  });

  const [addAdmin, { isLoading: isAdding }] = useAddAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [resetPassword] = useResetAdminPasswordMutation();


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

  const handleDelete = (id) => {
    setConfirmModal({ 
      open: true, 
      type: 'delete', 
      admin: admins.find(admin => admin._id === id) 
    });
  };

  const handleResetPassword = (id) => {
    setConfirmModal({ 
      open: true, 
      type: 'reset', 
      admin: admins.find(admin => admin._id === id) 
    });
  };

  const confirmAction = async () => {
    if (!confirmModal.admin) return;
    
    try {
      if (confirmModal.type === 'delete') {
        await deleteAdmin(confirmModal.admin._id).unwrap();
        toast.success('Admin deleted successfully');
      } else if (confirmModal.type === 'reset') {
        await resetPassword(confirmModal.admin._id).unwrap();
        toast.success('Password reset email sent');
      }
    } catch (err) {
      toast.error(err.data?.error || 'An error occurred');
    } finally {
      setConfirmModal({ open: false, type: '', admin: null });
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, type: '', admin: null });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addAdmin(form).unwrap();
      toast.success('Admin added successfully');
      setModalOpen(false);
      setForm({ username: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error(err.data?.error || 'Failed to add admin');
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <button
          className="px-4 py-2 rounded bg-accent-500 text-white font-semibold hover:bg-accent-600"
          onClick={() => setModalOpen(true)}
        >
          Add Admin
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name, email, role, or ID..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" 
        />
      </div>

      {isLoading ? (
        <SimpleSpinner message="Loading admins..." />
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          {error.data?.error || 'Failed to load admins'}
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No admins found.</div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No admins match your search criteria.</div>
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
              {filteredAdmins.map(admin => (
                <tr key={admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{admin.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {admin._id !==currentAdmin._id && (
                      <>
                        <button
                          className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                          onClick={() => handleDelete(admin._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                          onClick={() => handleResetPassword(admin._id)}
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

      {/* Add Admin Modal */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg text-white bg-accent-500 hover:bg-accent-600 transition ${isAdding ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add Admin'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                  onClick={() => setModalOpen(false)}
                  disabled={isAdding}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
                className={`px-4 py-2 rounded text-white font-semibold ${
                  confirmModal.type === 'delete' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-accent-500 hover:bg-accent-600'
                }`}
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
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default AdminManagement;