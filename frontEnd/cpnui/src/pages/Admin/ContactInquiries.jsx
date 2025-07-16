import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ContactInquiries = ({ token }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete inquiry');
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMark = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated');
      fetchInquiries();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No inquiries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map(inq => (
                <tr key={inq.id || inq._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{inq.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">{inq.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inq.message.slice(0, 40)}{inq.message.length > 40 ? '...' : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${inq.status === 'responded' ? 'bg-green-100 text-green-700' : inq.status === 'read' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{inq.status || 'unread'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
                      onClick={() => { setSelected(inq); setModalOpen(true); }}
                    >
                      View
                    </button>
                    {inq.status !== 'read' && (
                      <button
                        className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold"
                        onClick={() => handleMark(inq.id || inq._id, 'read')}
                      >
                        Mark as Read
                      </button>
                    )}
                    {inq.status !== 'responded' && (
                      <button
                        className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                        onClick={() => handleMark(inq.id || inq._id, 'responded')}
                      >
                        Mark as Responded
                      </button>
                    )}
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                      onClick={() => handleDelete(inq.id || inq._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for viewing full inquiry */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Email:</span> {selected.email}</p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Date:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}</p>
            <div className="mt-4">
              <p className="text-gray-900 whitespace-pre-line">{selected.message}</p>
            </div>
            <div className="flex gap-2 mt-6">
              {selected.status !== 'read' && (
                <button
                  className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold"
                  onClick={() => { handleMark(selected.id || selected._id, 'read'); setModalOpen(false); }}
                >
                  Mark as Read
                </button>
              )}
              {selected.status !== 'responded' && (
                <button
                  className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                  onClick={() => { handleMark(selected.id || selected._id, 'responded'); setModalOpen(false); }}
                >
                  Mark as Responded
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInquiries; 