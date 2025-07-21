import { useState } from 'react';
import { useLoginMutation } from '../../features/auth/authApi';
import { useAdminAuth } from '../../app/useAdminAuth';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const { login: setAuth } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form).unwrap();
      setAuth(result.token, result.admin);
      toast.success('Login successful!');
      // Navigate to the original intended destination, or /admin if none exists
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <Link to="/admin/forgot-password" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin; 