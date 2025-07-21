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
import EnrolleeManagement from './EnrolleeManagement';
import { useAdminAuth } from '../../app/useAdminAuth';
import { FaUserGraduate, FaUsers, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const { token, admin, login, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // Analytics dashboard data
  const [analytics, setAnalytics] = useState({ enrollees: 0, subscribers: 0, events: 0, blogs: 0 });
  const [monthlyCounts, setMonthlyCounts] = useState([]);
  useEffect(() => {
    if (activeSection === 'dashboard' && token) {
      (async () => {
        const [enrolleesRes, subscribersRes, eventsRes, blogsRes, monthlyCountsRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/enrollments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/subscribers', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/events', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/blog', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/subscribers/monthly-counts', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const enrollees = (await enrolleesRes.json()).enrollments?.length || 0;
        const subscribers = (await subscribersRes.json()).subscribers?.length || 0;
        const events = (await eventsRes.json()).events?.length || 0;
        const blogs = (await blogsRes.json()).blogs?.length || 0;
        setAnalytics({ enrollees, subscribers, events, blogs });
        const monthly = (await monthlyCountsRes.json()).data || [];
        // Format for chart: [{ name: '2024-06', count: 10 }, ...]
        setMonthlyCounts(monthly.map(m => ({ name: `${m.year}-${String(m.month).padStart(2, '0')}`, count: Number(m.count) })));
      })();
    }
  }, [activeSection, token]);

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
    } catch {
      toast.error('Login error');
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const updatedAdmin = await response.json();
        // Update the admin context with new data
        login(token, updatedAdmin);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
  };

  // Ensure only super admins can access admin management
  useEffect(() => {
    if (admin && admin.role !== 'superadmin' && activeSection === 'admin-management') {
      setActiveSection('profile');
      toast.error('Access denied. Only super admins can manage other admins.');
    }
  }, [admin, activeSection]);

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
        {activeSection === 'dashboard' && (
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Admin Analytics Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <FaUserGraduate className="text-5xl text-amber-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900">{analytics.enrollees}</div>
                <div className="text-lg text-gray-600 mt-2">Enrolled Students</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <FaUsers className="text-5xl text-amber-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900">{analytics.subscribers}</div>
                <div className="text-lg text-gray-600 mt-2">Subscribers</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <FaCalendarAlt className="text-5xl text-amber-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900">{analytics.events}</div>
                <div className="text-lg text-gray-600 mt-2">Events</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <FaFileAlt className="text-5xl text-amber-600 mb-4" />
                <div className="text-4xl font-bold text-gray-900">{analytics.blogs}</div>
                <div className="text-lg text-gray-600 mt-2">Blogs</div>
              </div>
            </div>
          </div>
        )}
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
        {activeSection === 'admin-management' && admin?.role === 'superadmin' && (
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
        {activeSection === 'enrollees' && (
          <EnrolleeManagement token={token} />
        )}
        {activeSection === 'dashboard' && (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Subscribers Per Month (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCounts} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f59e42" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard; 