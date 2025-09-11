import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import SimpleSpinner from '../../components/SimpleSpinner';
import { useGetEventsQuery, useDeleteEventMutation } from '../../features/event/eventApi';

const AdminEvents = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const PER_PAGE = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useGetEventsQuery();
  const events = useMemo(() => {
    return data?.events ?? [];
  }, [data]);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
      await deleteEvent(eventToDelete.event_id).unwrap();
      toast.success('Event deleted successfully');
      setShowDeleteModal(false);
      setEventToDelete(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting event');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
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
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
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
          <Link to="/admin/events/create" className="bg-accent-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-accent-700 transition-colors">
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
                      <button 
                        onClick={() => navigate(`/admin/events/edit/${ev.event_id}`)} 
                        className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded"
                        title="Edit Event"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(ev)} 
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                        title="Delete Event"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-accent-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this event?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">{eventToDelete.title}</h4>
                <p className="text-sm text-red-700">
                  This action cannot be undone. All registrations for this event will also be deleted.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEvents; 