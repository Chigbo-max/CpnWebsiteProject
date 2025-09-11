import { useState } from 'react';
import { useForgotPasswordRequestMutation } from '../../features/auth/authApi';
import { toast } from 'sonner';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [requestReset, { isLoading }] = useForgotPasswordRequestMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestReset({ email }).unwrap();
      setSubmitted(true);
      toast.success('If an account with that email exists, a reset link has been sent.');
    } catch {
      setSubmitted(true);
      toast.success('If an account with that email exists, a reset link has been sent.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Forgot Password</h2>
        <p className="mb-4 text-gray-700 text-sm">
          Enter your admin email address. If an account exists, you will receive a password reset link. For your security, we do not indicate whether an email is registered.
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
            disabled={submitted}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || submitted}
          className="w-full bg-accent-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-accent-600 transition-all duration-300 hover:bg-accent-700 hover:border-accent-700 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : submitted ? 'Request Sent' : 'Send Reset Link'}
        </button>
        <div className="mt-4 text-xs text-gray-500">
          Too many requests? Please wait a few minutes before trying again.
        </div>
      </form>
    </div>
  );
};

export default AdminForgotPassword; 