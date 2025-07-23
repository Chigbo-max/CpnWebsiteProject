import { useMeQuery, useLogoutMutation } from '../../features/auth/authApi';
import { useAdminAuth } from '../../app/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminProfile = () => {
  const { data: admin, isLoading, isError, error } = useMeQuery();
  const [logout] = useLogoutMutation();
  const { logout: clearAuth } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      toast.error('Failed to log out. Please try again.');
        return;
    }
    clearAuth();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (isError) return <div className="p-8 text-red-600">{error?.data?.message || error?.message || 'Error loading profile.'}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Profile</h2>
      <div className="mb-4">
        <span className="font-semibold">Name:</span> {admin?.name || 'N/A'}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email:</span> {admin?.email || 'N/A'}
      </div>
      {admin?.tokenExpiry && (
        <div className="mb-4">
          <span className="font-semibold">Token Expires:</span> {new Date(admin.tokenExpiry).toLocaleString()}
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-red-600 transition-all duration-300 hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminProfile; 