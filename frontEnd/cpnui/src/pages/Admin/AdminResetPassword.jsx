import { useState, useEffect } from 'react';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    if (password.length < 12) {
      toast.error('Password must be at least 12 characters.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await resetPassword({ token, password }).unwrap();
      setSubmitted(true);
      toast.success('Password reset successful. You may now log in.');
    } catch (err) {
      toast.error(err?.data?.message || 'Reset failed. The link may be invalid or expired.');
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/admin/login');
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Reset Password</h2>
        {!token && <div className="mb-4 text-red-600">Invalid or missing reset token.</div>}
        {submitted ? (
          <div className="text-green-700 font-semibold">Password reset successful. You may now log in.</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={12}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                disabled={!token}
                autoComplete="new-password"
              />
              <div className="text-xs text-gray-500 mt-1">
                Must be at least 12 characters and include uppercase, lowercase, number, and special character.
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={12}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                disabled={!token}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-accent-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-accent-600 transition-all duration-300 hover:bg-accent-700 hover:border-accent-700 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AdminResetPassword; 