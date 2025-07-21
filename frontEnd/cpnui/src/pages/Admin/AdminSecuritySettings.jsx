import { useState } from 'react';
import { useAdminAuth } from '../../app/useAdminAuth';
import { toast } from 'sonner';
import { useChangePasswordMutation, useGetAuditLogQuery } from '../../features/auth/authApi';

const AdminSecuritySettings = () => {
  const { token } = useAdminAuth();
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { data: auditLog = [], isLoading: logLoading } = useGetAuditLogQuery();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      toast.error('Password must be at least 12 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      toast.error('Password must include uppercase, lowercase, number, and special character.');
      return;
    }
    if (newPassword !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await changePassword({ currentPassword: current, newPassword }).unwrap();
      toast.success('Password changed successfully.');
      setCurrent(''); setNewPassword(''); setConfirm('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Security Settings</h2>
      <form onSubmit={handleChangePassword} className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoComplete="current-password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            minLength={12}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoComplete="new-password"
          />
          <div className="text-xs text-gray-500 mt-1">
            Must be at least 12 characters and include uppercase, lowercase, number, and special character.
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={12}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Security Activity</h3>
        {logLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : auditLog.length === 0 ? (
          <div className="text-gray-500">No recent activity.</div>
        ) : (
          <ul className="text-sm">
            {auditLog.map((log, i) => (
              <li key={i} className="mb-2">
                {log.timestamp}: {log.type} ({log.status}) from {log.ip} - {log.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication (2FA)</h3>
        <div className="text-gray-500">2FA setup coming soon.</div>
      </div>
    </div>
  );
};

export default AdminSecuritySettings; 