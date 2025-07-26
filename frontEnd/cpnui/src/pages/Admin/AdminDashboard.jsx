import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUsers, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { ResponsiveBar, ResponsivePie } from '@nivo/bar';
import {
  useGetEnrolleesCountQuery,
  useGetSubscribersCountQuery,
  useGetEventsCountQuery,
  useGetBlogsCountQuery,
  useGetMonthlySubscriberCountsQuery,
  useGetMonthlyEnrolleeCountsQuery,
  useAdminLoginMutation,
} from './adminDashboardApi';
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

function AdminDashboard() {
  const { token, admin, login, logout, shouldRedirect, setShouldRedirect } = useAdminAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // RTK Query hooks
  const { data: enrolleesCount = 0 } = useGetEnrolleesCountQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: subscribersCount = 0 } = useGetSubscribersCountQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: eventsCount = 0 } = useGetEventsCountQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: blogsCount = 0 } = useGetBlogsCountQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: monthlyCounts = [] } = useGetMonthlySubscriberCountsQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const { data: enrolleeMonthlyCounts = [] } = useGetMonthlyEnrolleeCountsQuery(undefined, {
    skip: activeSection !== 'dashboard' || !token,
  });
  const [adminLogin] = useAdminLoginMutation();

  const analytics = {
    enrollees: enrolleesCount,
    subscribers: subscribersCount,
    events: eventsCount,
    blogs: blogsCount,
  };

  // WebSocket for real-time updates
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 
                  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    
    let ws;
    if (activeSection === 'dashboard' && token) {
      ws = new window.WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'dashboard-update') {
          toast.info('Dashboard data updated');
        }
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [activeSection, token]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/admin/login');
      setShouldRedirect(false);
    }
  }, [shouldRedirect, navigate, setShouldRedirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, admin } = await adminLogin(loginData).unwrap();
      login(token, admin);
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = (updatedAdmin) => {
    login(token, updatedAdmin);
    toast.success('Profile updated successfully');
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

  // Prepare Nivo data for subscribers bar chart
  const subscriberBarData = monthlyCounts.map(m => ({
    month: m.name,
    subscribers: m.count
  }));

  // Prepare Nivo data for enrollees bar chart
  const enrolleeBarData = enrolleeMonthlyCounts.map(m => ({
    month: m.name,
    enrollees: m.count
  }));

  // Prepare Nivo bar chart data (compare all analytics)
  const overviewBarData = [
    { category: 'Enrollees', count: analytics.enrollees },
    { category: 'Subscribers', count: analytics.subscribers },
    { category: 'Events', count: analytics.events },
    { category: 'Blogs', count: analytics.blogs },
  ];

  // Prepare Nivo pie chart data (distribution)
  const pieData = [
    { id: 'Enrollees', label: 'Enrollees', value: analytics.enrollees, color: 'hsl(210, 70%, 50%)' },
    { id: 'Subscribers', label: 'Subscribers', value: analytics.subscribers, color: 'hsl(34, 70%, 50%)' },
    { id: 'Events', label: 'Events', value: analytics.events, color: 'hsl(120, 70%, 50%)' },
    { id: 'Blogs', label: 'Blogs', value: analytics.blogs, color: 'hsl(10, 70%, 50%)' },
  ];

  if (!token) {
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
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12">
              {[
                { icon: <FaUserGraduate className="text-5xl text-amber-600 mb-4" />, 
                  value: analytics.enrollees, label: 'Enrolled Students' },
                { icon: <FaUsers className="text-5xl text-amber-600 mb-4" />, 
                  value: analytics.subscribers, label: 'Subscribers' },
                { icon: <FaCalendarAlt className="text-5xl text-amber-600 mb-4" />, 
                  value: analytics.events, label: 'Events' },
                { icon: <FaFileAlt className="text-5xl text-amber-600 mb-4" />, 
                  value: analytics.blogs, label: 'Blogs' },
              ].map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                  {card.icon}
                  <div className="text-4xl font-bold text-gray-900">{card.value}</div>
                  <div className="text-lg text-gray-600 mt-2">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            {[
              { 
                title: 'Overview Comparison', 
                chart: (
                  <ResponsiveBar
                    data={overviewBarData}
                    keys={['count']}
                    indexBy="category"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{
                      tickRotation: -45,
                      legend: 'Category',
                      legendPosition: 'middle',
                      legendOffset: 40,
                    }}
                    axisLeft={{
                      legend: 'Count',
                      legendPosition: 'middle',
                      legendOffset: -50,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    animate={true}
                  />
                ),
                data: overviewBarData
              },
              { 
                title: 'Distribution', 
                chart: <ResponsivePie data={pieData} {...pieChartConfig} />,
                data: pieData
              },
              { 
                title: 'Subscribers Per Month (Last 12 Months)', 
                chart: (
                  <ResponsiveBar
                    data={subscriberBarData}
                    keys={['subscribers']}
                    indexBy="month"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'category10' }}
                    axisBottom={{
                      tickRotation: -45,
                      legend: 'Month',
                      legendPosition: 'middle',
                      legendOffset: 40,
                    }}
                    axisLeft={{
                      legend: 'Subscribers',
                      legendPosition: 'middle',
                      legendOffset: -50,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    animate={true}
                  />
                ),
                data: subscriberBarData
              },
              { 
                title: 'Enrolled Students Per Month (Last 5 Years)', 
                chart: (
                  <ResponsiveBar
                    data={enrolleeBarData}
                    keys={['enrollees']}
                    indexBy="month"
                    margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'category10' }}
                    axisBottom={{
                      tickRotation: -45,
                      legend: 'Month',
                      legendPosition: 'middle',
                      legendOffset: 40,
                    }}
                    axisLeft={{
                      legend: 'Enrollees',
                      legendPosition: 'middle',
                      legendOffset: -50,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    animate={true}
                  />
                ),
                data: enrolleeBarData
              },
            ].map((chart, index) => (
              <div key={index} className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">{chart.title}</h3>
                <div style={{ height: 300 }}>
                  {chart.data.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                  ) : (
                    chart.chart
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Sections */}
        {activeSection === 'profile' && (
          <Profile showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword} />
        )}
        {activeSection === 'subscribers' && (
          <Suspense fallback={<SimpleSpinner message="Loading Subscribers..." />}>
            <Subscribers />
          </Suspense>
        )}
        {activeSection === 'newsletter' && (
          <Suspense fallback={<SimpleSpinner message="Loading Newsletter..." />}>
            <Newsletter />
          </Suspense>
        )}
        {activeSection === 'blog-create' && <BlogCreate />}
        {activeSection === 'blog-list' && <BlogList />}
        {activeSection === 'inquiries' && <ContactInquiries />}
        {activeSection === 'admin-management' && admin?.role === 'superadmin' && (
          <AdminManagement currentAdmin={admin} />
        )}
        {activeSection === 'events' && <AdminEvents />}
        {activeSection === 'create-event' && <EventCreate />}
        {activeSection === 'event-registrations' && <EventRegistrations />}
        {activeSection === 'enrollees' && <EnrolleeManagement />}
      </div>
    </AdminLayout>
  );
}

// Pie chart configuration
const pieChartConfig = {
  margin: { top: 30, right: 40, bottom: 60, left: 60 },
  innerRadius: 0.5,
  padAngle: 1,
  cornerRadius: 5,
  activeOuterRadiusOffset: 8,
  colors: { scheme: 'nivo' },
  borderWidth: 1,
  borderColor: { from: 'color', modifiers: [['darker', 0.2]] },
  arcLinkLabelsSkipAngle: 10,
  arcLinkLabelsTextColor: "#333",
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: 'color' },
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: { from: 'color', modifiers: [['darker', 2]] },
  tooltip: ({ datum }) => (
    <div style={{ 
      color: datum.color, 
      padding: 8, 
      background: '#fff', 
      borderRadius: 4, 
      boxShadow: '0 2px 8px #0001' 
    }}>
      <strong>{datum.label}:</strong> {datum.value}
    </div>
  ),
  theme: {
    axis: {
      ticks: { text: { fontSize: 12, fill: '#333' } },
      legend: { text: { fontSize: 14, fill: '#222' } }
    },
    grid: { line: { stroke: '#eee', strokeWidth: 1 } }
  }
};

export default AdminDashboard;