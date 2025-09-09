import { useState, useEffect, Suspense, useRef } from 'react';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import { useAdminAuth } from '../../app/useAdminAuth';
import { useAuthErrorHandler } from '../../app/useAuthErrorHandler';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUsers, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
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
import UserManagement from './UserManagement';
import ErrorBoundary from '../../pages/Error/ErrorBoundary';

function AdminDashboard() {
  const { token, admin, login, logout, shouldRedirect, setShouldRedirect } = useAdminAuth();
  const { handleMultipleResponses } = useAuthErrorHandler();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [analytics, setAnalytics] = useState({ enrollees: 0, subscribers: 0, events: 0, blogs: 0 });
  const [monthlyCounts, setMonthlyCounts] = useState([]);
  const [enrolleeMonthlyCounts, setEnrolleeMonthlyCounts] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
  const wsUrl =
    import.meta.env.VITE_WS_URL ||
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

  // refs for websocket + reconnect timer
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    try {
      const endpoints = [
        { url: `${apiBaseUrl}/enrollments/admin/enrollments`, key: 'enrollees', process: (data) => data.enrollments?.length || 0 },
        { url: `${apiBaseUrl}/subscribers`, key: 'subscribers', process: (data) => data.subscribers?.length || 0 },
        { url: `${apiBaseUrl}/events`, key: 'events', process: (data) => data.events?.length || 0 },
        { url: `${apiBaseUrl}/admin/blog`, key: 'blogs', process: (data) => data.blogs?.length || data.length || 0 },
        {
          url: `${apiBaseUrl}/subscribers/monthly-counts`,
          key: 'monthlyCounts',
          process: (data) => (data.data || []).map((m) => ({
            month: `${m.year}-${String(m.month).padStart(2, '0')}`,
            subscribers: Number(m.count),
          })),
        },
        {
          url: `${apiBaseUrl}/enrollments/monthly-counts?months=60`,
          key: 'enrolleeMonthlyCounts',
          process: (data) => (data.data || []).map((m) => ({
            month: `${m.year}-${String(m.month).padStart(2, '0')}`,
            enrollees: Number(m.count),
          })),
        },
      ];

      const results = {};
      for (const endpoint of endpoints) {
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 2000;

        while (retryCount < maxRetries) {
          try {
            const response = await fetch(endpoint.url, {
              headers: { Authorization: `Bearer ${token}` },
              signal: AbortSignal.timeout(10000),
            });

            if (response.status === 429) {
              retryCount++;
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            }

            if (handleMultipleResponses([response])) continue;
            if (!response.ok) break;

            const data = await response.json();
            results[endpoint.key] = endpoint.process(data);
            break;
          } catch {
            break;
          }
        }
      }

      setAnalytics({
        enrollees: results.enrollees || 0,
        subscribers: results.subscribers || 0,
        events: results.events || 0,
        blogs: results.blogs || 0,
      });
      setMonthlyCounts(results.monthlyCounts || []);
      setEnrolleeMonthlyCounts(results.enrolleeMonthlyCounts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data.');
    }
  };

  // --- WEBSOCKET with exponential backoff ---
  useEffect(() => {
    if (activeSection !== 'dashboard' || !token) return;

    function connectWebSocket() {
      const ws = new window.WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("websocket connected");
        reconnectAttemptsRef.current = 0; // reset attempts
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'dashboard-update') {
            fetchDashboardData();
          }
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');

        // exponential backoff: 2^attempts * 1000ms (capped at 30s)
        const delay = Math.min(30000, Math.pow(2, reconnectAttemptsRef.current) * 1000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnecting WebSocket (attempt ${reconnectAttemptsRef.current}) in ${delay / 1000}s...`);
          connectWebSocket();
        }, delay);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    fetchDashboardData();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeSection, token, wsUrl]);

  // forced redirect
  useEffect(() => {
    if (shouldRedirect) {
      navigate('/admin/login');
      setShouldRedirect(false);
    }
  }, [shouldRedirect, navigate, setShouldRedirect]);

  // restrict access
  useEffect(() => {
    if (admin && admin.role !== 'superadmin' && activeSection === 'admin-management') {
      setActiveSection('profile');
      toast.error('Access denied. Only super admins can manage other admins.');
    }
  }, [admin, activeSection]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SimpleSpinner message="Redirecting to login..." />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
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

  const handleShowChangePassword = () => setShowChangePassword(true);

  // Chart data
  const barData = [
    { category: 'Enrollees', count: analytics.enrollees },
    { category: 'Subscribers', count: analytics.subscribers },
    { category: 'Events', count: analytics.events },
    { category: 'Blogs', count: analytics.blogs },
  ];

  const pieData = [
    { id: 'Enrollees', label: 'Enrollees', value: analytics.enrollees },
    { id: 'Subscribers', label: 'Subscribers', value: analytics.subscribers },
    { id: 'Events', label: 'Events', value: analytics.events },
    { id: 'Blogs', label: 'Blogs', value: analytics.blogs },
  ];

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onShowChangePassword={handleShowChangePassword}
    >
      <ErrorBoundary>
        <div className="w-full h-full">
          {activeSection === 'dashboard' && (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
              {/* Summary Cards */}
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Admin Analytics Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12">
                <SummaryCard icon={<FaUserGraduate />} value={analytics.enrollees} label="Enrolled Students" />
                <SummaryCard icon={<FaUsers />} value={analytics.subscribers} label="Subscribers" />
                <SummaryCard icon={<FaCalendarAlt />} value={analytics.events} label="Events" />
                <SummaryCard icon={<FaFileAlt />} value={analytics.blogs} label="Blogs" />
              </div>

              {/* Charts */}
              <ChartCard title="Overview Comparison (Bar Chart)">
                <BarChart data={barData} indexBy="category" keys={['count']} />
              </ChartCard>

              <ChartCard title="Distribution (Pie Chart)">
                <PieChart data={pieData} />
              </ChartCard>

              <ChartCard title="Subscribers Per Month (Last 12 Months)">
                <BarChart data={monthlyCounts.slice(-12)} indexBy="month" keys={['subscribers']} />
              </ChartCard>

              <ChartCard title="Enrolled Students Per Month (Last 5 Years)">
                <BarChart data={enrolleeMonthlyCounts} indexBy="month" keys={['enrollees']} />
              </ChartCard>
            </div>
          )}

          {/* Sections */}
          {activeSection === 'profile' && (
            <Profile
              admin={admin}
              onUpdate={handleProfileUpdate}
              showChangePassword={showChangePassword}
              setShowChangePassword={setShowChangePassword}
            />
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
          {activeSection === 'blog-create' && <BlogCreate token={token} />}
          {activeSection === 'blog-list' && <BlogList token={token} />}
          {activeSection === 'inquiries' && <ContactInquiries token={token} />}
          {activeSection === 'admin-management' && admin?.role === 'superadmin' && (
            <AdminManagement token={token} currentAdmin={admin} />
          )}
          {activeSection === 'events' && <AdminEvents />}
          {activeSection === 'create-event' && <EventCreate />}
          {activeSection === 'event-registrations' && <EventRegistrations />}
          {activeSection === 'enrollees' && <EnrolleeManagement token={token} />}
          {activeSection === 'user-management' && <UserManagement token={token} />}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
}

function SummaryCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <div className="text-5xl text-amber-600 mb-4">{icon}</div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
      <div className="text-lg text-gray-600 mt-2">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <div style={{ height: 300 }}>{children}</div>
    </div>
  );
}

function BarChart({ data, indexBy, keys }) {
  return data.length === 0 || data.every((d) => keys.every((k) => d[k] === 0)) ? (
    <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
  ) : (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 30, right: 40, bottom: 60, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'category10' }}
      axisBottom={{
        legend: indexBy === 'month' ? 'Month' : 'Category',
        legendOffset: 40,
        legendPosition: 'middle',
        tickRotation: -45,
      }}
      axisLeft={{
        legend: keys[0],
        legendOffset: -50,
        legendPosition: 'middle',
      }}
      enableLabel={false}
      tooltip={({ id, value, color }) => (
        <div
          style={{
            color,
            padding: 8,
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 2px 8px #0001',
          }}
        >
          <strong>{id}:</strong> {value}
        </div>
      )}
      theme={{
        axis: {
          ticks: { text: { fontSize: 12, fill: '#333' } },
          legend: { text: { fontSize: 14, fill: '#222' } },
        },
        grid: { line: { stroke: '#eee', strokeWidth: 1 } },
      }}
    />
  );
}

function PieChart({ data }) {
  return data.length === 0 || data.every((d) => d.value === 0) ? (
    <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
  ) : (
    <ResponsivePie
      data={data}
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
        <div
          style={{
            color: datum.color,
            padding: 8,
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 2px 8px #0001',
          }}
        >
          <strong>{datum.label}:</strong> {datum.value}
        </div>
      )}
    />
  );
}

export default AdminDashboard;
