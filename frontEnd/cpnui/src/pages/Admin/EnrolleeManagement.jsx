import React, { useEffect, useState } from 'react';

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const EnrolleeManagement = ({ token }) => {
  const [enrollees, setEnrollees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState(null);

  const fetchEnrollees = async () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/admin/enrollments';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEnrollees(data.enrollments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollees();
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastStatus(null);
    const res = await fetch('http://localhost:5000/api/admin/enrollments/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, content, startDate, endDate }),
    });
    const data = await res.json();
    if (res.ok) {
      setBroadcastStatus({ type: 'success', message: data.message });
    } else {
      setBroadcastStatus({ type: 'error', message: data.error });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Enrollee Management</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <button onClick={fetchEnrollees} className="bg-amber-600 text-white px-4 py-2 rounded mt-6 md:mt-0">Filter</button>
      </div>
      {loading ? (
        <div>Loading enrollees...</div>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Enrollment Date</th>
                <th className="px-4 py-2">Enrollment ID</th>
              </tr>
            </thead>
            <tbody>
              {enrollees.map((enrollee) => (
                <tr key={enrollee.enrollment_id} className="border-t">
                  <td className="px-4 py-2">{enrollee.name}</td>
                  <td className="px-4 py-2">{enrollee.email}</td>
                  <td className="px-4 py-2">{enrollee.course}</td>
                  <td className="px-4 py-2">{formatDate(enrollee.enrolled_at)}</td>
                  <td className="px-4 py-2">{enrollee.enrollment_id}</td>
                </tr>
              ))}
              {enrollees.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4">No enrollees found for selected period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <form onSubmit={handleBroadcast} className="bg-gray-50 p-4 rounded mb-2">
        <h3 className="text-lg font-semibold mb-2">Send Broadcast Email to Filtered Enrollees</h3>
        <div className="mb-2">
          <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" required />
          <textarea placeholder="Message content" value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} required />
        </div>
        <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded">Send Broadcast</button>
        {broadcastStatus && (
          <div className={`mt-2 ${broadcastStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{broadcastStatus.message}</div>
        )}
      </form>
    </div>
  );
};

export default EnrolleeManagement; 