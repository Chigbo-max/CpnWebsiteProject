import { useState, useEffect, Suspense } from 'react';
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
  const wsUrl = import.meta.env.VITE_WS_URL || 
                `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (activeSection === 'dashboard' && token) {
      (async () => {
        try {
          const [enrolleesRes, subscribersRes, eventsRes, blogsRes, monthlyCountsRes, enrolleeMonthlyCountsRes] = await Promise.all([
            fetch(`${apiBaseUrl}/enrollments/admin/enrollments`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${apiBaseUrl}/subscribers`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${apiBaseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${apiBaseUrl}/admin/blog`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${apiBaseUrl}/subscribers/monthly-counts`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${apiBaseUrl}/enrollments/monthly-counts?months=60`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          
          // Check if any response is unauthorized (401) - token expired
          const responses = [enrolleesRes, subscribersRes, eventsRes, blogsRes, monthlyCountsRes, enrolleeMonthlyCountsRes];
          
          if (handleMultipleResponses(responses)) {
            return; 
          }
          
          const hasError = responses.some(res => !res.ok);
          
          if (hasError) {
            console.error('Some API calls failed in dashboard');
           
            return;
          }
          
          const enrollees = (await enrolleesRes.json()).enrollments?.length || 0;
          const subscribers = (await subscribersRes.json()).subscribers?.length || 0;
          const events = (await eventsRes.json()).events?.length || 0;
          const blogsData = await blogsRes.json();
          const blogs = blogsData.blogs?.length || blogsData.length || 0;
          setAnalytics({ enrollees, subscribers, events, blogs });
          const monthly = (await monthlyCountsRes.json()).data || [];
          setMonthlyCounts(monthly.map(m => ({ month: `${m.year}-${String(m.month).padStart(2, '0')}`, subscribers: Number(m.count) })));
          const enrolleeMonthly = (await enrolleeMonthlyCountsRes.json()).data || [];
          setEnrolleeMonthlyCounts(enrolleeMonthly.map(m => ({ month: `${m.year}-${String(m.month).padStart(2, '0')}`, enrollees: Number(m.count) })));
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      })();
    }
    // WebSocket for real-time updates
    let ws;
    if (activeSection === 'dashboard') {
      ws = new window.WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'dashboard-update') {
          // Refetch analytics data on any dashboard update
          (async () => {
            try {
              const [enrolleesRes, subscribersRes, eventsRes, blogsRes, monthlyCountsRes, enrolleeMonthlyCountsRes] = await Promise.all([
                fetch(`${apiBaseUrl}/enrollments/admin/enrollments`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/subscribers`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/admin/blog`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/subscribers/monthly-counts`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/enrollments/monthly-counts?months=60`, { headers: { Authorization: `Bearer ${token}` } }),
              ]);
              
              // Check if any response is unauthorized (401) - token expired
              const responses = [enrolleesRes, subscribersRes, eventsRes, blogsRes, monthlyCountsRes, enrolleeMonthlyCountsRes];
              
              if (handleMultipleResponses(responses)) {
                return; // Authentication error was handled, exit early
              }
              
              // Check if all responses are ok
              const hasError = responses.some(res => !res.ok);
              
              if (hasError) {
                console.error('Some API calls failed in dashboard update');
                // Log individual response statuses for debugging
                return;
              }
              
              const enrollees = (await enrolleesRes.json()).enrollments?.length || 0;
              const subscribers = (await subscribersRes.json()).subscribers?.length || 0;
              const events = (await eventsRes.json()).events?.length || 0;
              const blogsData = await blogsRes.json();
              const blogs = blogsData.blogs?.length || blogsData.length || 0;
              setAnalytics({ enrollees, subscribers, events, blogs });
              const monthly = (await monthlyCountsRes.json()).data || [];
              setMonthlyCounts(monthly.map(m => ({ month: `${m.year}-${String(m.month).padStart(2, '0')}`, subscribers: Number(m.count) })));
              const enrolleeMonthly = (await enrolleeMonthlyCountsRes.json()).data || [];
              setEnrolleeMonthlyCounts(enrolleeMonthly.map(m => ({ month: `${m.year}-${String(m.month).padStart(2, '0')}`, enrollees: Number(m.count) })));
            } catch (error) {
              console.error('Error updating dashboard data:', error);
            }
          })();
        }
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [activeSection, token, apiBaseUrl, wsUrl, handleMultipleResponses]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/admin/login');
      setShouldRedirect(false);
    }
  }, [shouldRedirect, navigate, setShouldRedirect]);

  useEffect(() => {
    if (admin && admin.role !== 'superadmin' && activeSection === 'admin-management') {
      setActiveSection('profile');
      toast.error('Access denied. Only super admins can manage other admins.');
    }
  }, [admin, activeSection]);

  // Show loading while redirecting
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
            {/* Modern Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Overview Comparison (Bar Chart)</h3>
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
                    axisBottom={{ legend: 'Category', legendOffset: 40, legendPosition: 'middle', tickRotation: -45 }}
                    axisLeft={{ legend: 'Count', legendOffset: -50, legendPosition: 'middle' }}
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
            {/* Modern Pie Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Distribution (Pie Chart)</h3>
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
            {/* Subscribers Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Subscribers Per Month (Last 12 Months)</h3>
              <div style={{ height: 300 }}>
                {monthlyCounts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsiveBar
                    data={monthlyCounts.slice(-12)}
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
                    tooltip={({ value, color }) => (
                      <div style={{ color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>Subscribers:</strong> {value}
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
            {/* Enrollees Bar Chart */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Enrolled Students Per Month (Last 5 Years)</h3>
              <div style={{ height: 300 }}>
                {enrolleeMonthlyCounts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                ) : (
                  <ResponsiveBar
                    data={enrolleeMonthlyCounts}
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
                    tooltip={({ value, color }) => (
                      <div style={{ color, padding: 8, background: '#fff', borderRadius: 4, boxShadow: '0 2px 8px #0001' }}>
                        <strong>Enrollees:</strong> {value}
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