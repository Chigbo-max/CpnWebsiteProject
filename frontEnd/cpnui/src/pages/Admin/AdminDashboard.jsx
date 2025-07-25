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
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUsers, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { useGetAnalyticsQuery, useGetMonthlySubscribersQuery, useGetMonthlyEnrolleesQuery } from '../../features/admin/adminDashboardApi';

function AdminDashboard() {
  const { token, admin, login, logout, shouldRedirect, setShouldRedirect } = useAdminAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // RTK Query hooks
  const { data: analyticsData, refetch: refetchAnalytics } = useGetAnalyticsQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: monthlySubscribers } = useGetMonthlySubscribersQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: monthlyEnrollees } = useGetMonthlyEnrolleesQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });

  const analytics = analyticsData || { enrollees: 0, subscribers: 0, events: 0, blogs: 0 };
  const monthlyCounts = monthlySubscribers?.data || [];
  const enrolleeMonthlyCounts = monthlyEnrollees?.data || [];

  const wsUrl = import.meta.env.VITE_WS_URL;
  const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    // WebSocket for real-time updates
    let ws;
    if (activeSection === 'dashboard' && token) {
      ws = new window.WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'dashboard-update') {
          refetchAnalytics();
        }
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [activeSection, token, wsUrl, refetchAnalytics]);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/admin/login');
      setShouldRedirect(false);
    }
  }, [shouldRedirect, navigate, setShouldRedirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseApiUrl}/auth/login`, {
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
      const response = await fetch(`${baseApiUrl}/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedAdmin = await response.json();
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

  useEffect(() => {
    if (admin && admin.role !== 'superadmin' && activeSection === 'admin-management') {
      setActiveSection('profile');
      toast.error('Access denied. Only super admins can manage other admins.');
    }
  }, [admin, activeSection]);

  // Prepare Nivo bar chart data for subscribers
  const subscribersBarData = monthlyCounts.map(m => ({
    month: `${m.year}-${String(m.month).padStart(2, '0')}`,
    subscribers: Number(m.count)
  }));

  // Prepare Nivo bar chart data for enrolled students
  const enrolleesBarData = enrolleeMonthlyCounts.map(m => ({
    month: `${m.year}-${String(m.month).padStart(2, '0')}`,
    enrollees: Number(m.count)
  }));

  // Prepare Nivo bar chart data (compare all analytics)
  const barData = [
    {
      category: 'Enrollees',
      count: analytics.enrollees,
    },
    {
      category: 'Subscribers',
      count: analytics.subscribers,
    },
    {
      category: 'Events',
      count: analytics.events,
    },
    {
      category: 'Blogs',
      count: analytics.blogs,
    },
  ];

  // Prepare Nivo pie chart data (distribution)
  const pieData = [
    {
      id: 'Enrollees',
      label: 'Enrollees',
      value: analytics.enrollees,
      color: 'hsl(210, 70%, 50%)',
    },
    {
      id: 'Subscribers',
      label: 'Subscribers',
      value: analytics.subscribers,
      color: 'hsl(34, 70%, 50%)',
    },
    {
      id: 'Events',
      label: 'Events',
      value: analytics.events,
      color: 'hsl(120, 70%, 50%)',
    },
    {
      id: 'Blogs',
      label: 'Blogs',
      value: analytics.blogs,
      color: 'hsl(10, 70%, 50%)',
    },
  ];

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
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
            
            {/* Overview Comparison Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Overview Comparison</h3>
              <div style={{ height: 300 }}>
                {barData.every(d => d.count === 0) ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsiveBar
                    data={barData}
                    keys={["count"]}
                    indexBy="category"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{ 
                      legend: 'Category', 
                      legendOffset: 40, 
                      legendPosition: 'middle', 
                      tickRotation: -45 
                    }}
                    axisLeft={{ 
                      legend: 'Count', 
                      legendOffset: -50, 
                      legendPosition: 'middle' 
                    }}
                    enableLabel={false}
                    tooltip={({ id, value, color }) => (
                      <div style={{ color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>{id}:</strong> {value}
                      </div>
                    )}
                    theme={{
                      axis: {
                        ticks: { text: { fontSize: 12, fill: '#333' } },
                        legend: { text: { fontSize: 14, fill: '#222' } }
                      },
                      grid: { line: { stroke: '#eee', strokeWidth: 1 } }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Distribution Pie Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Distribution</h3>
              <div style={{ height: 300 }}>
                {pieData.every(d => d.value === 0) ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsivePie
                    data={pieData}
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    innerRadius={0.5}
                    padAngle={1}
                    cornerRadius={5}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'nivo' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    tooltip={({ datum }) => (
                      <div style={{ color: datum.color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>{datum.label}:</strong> {datum.value}
                      </div>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Subscribers Per Month Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Subscribers Per Month</h3>
              <div style={{ height: 300 }}>
                {subscribersBarData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsiveBar
                    data={subscribersBarData}
                    keys={['subscribers']}
                    indexBy="month"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'category10' }}
                    axisBottom={{ 
                      legend: 'Month', 
                      legendOffset: 40, 
                      legendPosition: 'middle', 
                      tickRotation: -45 
                    }}
                    axisLeft={{ 
                      legend: 'Subscribers', 
                      legendOffset: -50, 
                      legendPosition: 'middle' 
                    }}
                    enableLabel={false}
                    tooltip={({ id, value, color }) => (
                      <div style={{ color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>{id}:</strong> {value}
                      </div>
                    )}
                    theme={{
                      axis: {
                        ticks: { text: { fontSize: 12, fill: '#333' } },
                        legend: { text: { fontSize: 14, fill: '#222' } }
                      },
                      grid: { line: { stroke: '#eee', strokeWidth: 1 } }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Enrolled Students Per Month Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Enrolled Students Per Month</h3>
              <div style={{ height: 300 }}>
                {enrolleesBarData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsiveBar
                    data={enrolleesBarData}
                    keys={['enrollees']}
                    indexBy="month"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'category10' }}
                    axisBottom={{ 
                      legend: 'Month', 
                      legendOffset: 40, 
                      legendPosition: 'middle', 
                      tickRotation: -45 
                    }}
                    axisLeft={{ 
                      legend: 'Enrolled Students', 
                      legendOffset: -50, 
                      legendPosition: 'middle' 
                    }}
                    enableLabel={false}
                    tooltip={({ id, value, color }) => (
                      <div style={{ color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>{id}:</strong> {value}
                      </div>
                    )}
                    theme={{
                      axis: {
                        ticks: { text: { fontSize: 12, fill: '#333' } },
                        legend: { text: { fontSize: 14, fill: '#222' } }
                      },
                      grid: { line: { stroke: '#eee', strokeWidth: 1 } }
                    }}
                  />
                )}
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
          <BlogCreate token={token} onSuccess={() => { }} />
        )}
        {activeSection === 'blog-list' && (
          <BlogList token={token} onRefresh={() => { }} />
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
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;