import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../app/AdminAuthContext';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      setEvents(await res.json());
    } catch (err) {
      toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (event_id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${event_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted');
      setEvents(events.filter(ev => ev.event_id !== event_id));
    } catch (err) {
      toast.error('Error deleting event');
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Manage Events</h2>
        <Link to="/admin/events/create" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors">
          <FontAwesomeIcon icon={faPlus} /> Create Event
        </Link>
      </div>
      {loading ? (
        <div className="w-full text-center py-8 text-gray-500">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-400">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.event_id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{ev.title}</td>
                  <td className="p-3 text-gray-700">{ev.event_type}</td>
                  <td className="p-3 text-gray-700">{new Date(ev.start_time).toLocaleString()}</td>
                  <td className="p-3 text-gray-700">{new Date(ev.end_time).toLocaleString()}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => navigate(`/admin/events/edit/${ev.event_id}`)} className="text-amber-600 hover:text-amber-800"><FontAwesomeIcon icon={faEdit} /></button>
                    <button onClick={() => handleDelete(ev.event_id)} className="text-red-600 hover:text-red-800"><FontAwesomeIcon icon={faTrash} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEvents; 