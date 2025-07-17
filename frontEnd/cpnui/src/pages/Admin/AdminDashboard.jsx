import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import AdminLayout from './AdminLayout';
import Profile from './Profile';
import Subscribers from './Subscribers';
import Newsletter from './Newsletter';
import BlogCreate from './BlogCreate';
import BlogList from './BlogList';
import ContactInquiries from './ContactInquiries';
import AdminManagement from './AdminManagement';
import AdminEvents from './Events';
import EventCreate from './EventCreate';
import EventRegistrations from './EventRegistrations';
import { useAdminAuth } from '../../app/useAdminAuth';

function AdminDashboard() {
  const { token, admin, login, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      if (response.ok) {
        const data = await response.json();
        login(data.token, data.admin);
        setIsLoggedIn(true);
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error('Login error');
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleProfileUpdate = () => {
    // TODO: Send update to backend
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onShowChangePassword={handleShowChangePassword}
    >
      <div className="w-full h-full">
        {activeSection === 'profile' && (
          <Profile admin={admin} onUpdate={handleProfileUpdate} showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword} />
        )}
        {activeSection === 'subscribers' && (
          <Suspense fallback={<SimpleSpinner message="Loading Subscribers..." />}>
            <Subscribers token={token} />
          </Suspense>
        )}
        {activeSection === 'newsletter' && (
          <Suspense fallback={<SimpleSpinner message="Loading Newsletter..." />}>
            <Newsletter token={token} />
          </Suspense>
        )}
        {activeSection === 'blog-create' && (
          <BlogCreate token={token} onSuccess={() => {}} />
        )}
        {activeSection === 'blog-list' && (
          <BlogList token={token} onRefresh={() => {}} />
        )}
        {activeSection === 'inquiries' && (
          <ContactInquiries token={token} />
        )}
        {activeSection === 'admin-management' && (
          <AdminManagement token={token} currentAdmin={admin} />
        )}
        {activeSection === 'events' && (
          <AdminEvents />
        )}
        {activeSection === 'create-event' && (
          <EventCreate />
        )}
        {activeSection === 'event-registrations' && (
          <EventRegistrations />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard; 