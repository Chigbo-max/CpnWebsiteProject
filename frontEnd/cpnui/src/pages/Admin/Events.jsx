import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '../../app/useAdminAuth';
import SimpleSpinner from '../../components/SimpleSpinner';
import { useGetEventsQuery, useDeleteEventMutation } from '../../features/event/eventApi';

const AdminEvents = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useGetEventsQuery();
  const events = useMemo(() => {
    return data?.events ?? [];
  }, [data]);
  const [deleteEvent] = useDeleteEventMutation();

  const handleDelete = async (event_id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(event_id).unwrap();
      toast.success('Event deleted');
      refetch();
    } catch {
      toast.error('Error deleting event');
    }
  };

  const filtered = useMemo(() => {
    let data = events;
    if (search) {
      data = data.filter(ev =>
        (ev.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (ev.description || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (typeFilter) {
      data = data.filter(ev => ev.event_type === typeFilter);
    }
    return data;
  }, [search, typeFilter, events]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-2 py-2 rounded-lg border border-gray-300"
          >
            <option value="">All Types</option>
            <option value="physical">Physical</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <Link to="/admin/events/create" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors">
          <FontAwesomeIcon icon={faPlus} /> Create Event
        </Link>
      </div>
      {isLoading ? (
        <SimpleSpinner message="Loading events..." />
      ) : isError ? (
        <div className="w-full text-center py-8 text-red-400">{error?.data?.message || error?.message || 'Error loading events.'}</div>
      ) : paginated.length === 0 ? (
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
              {paginated.map(ev => (
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
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminEvents; 