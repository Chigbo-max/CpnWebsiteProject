import React, { useState } from 'react';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import { 
  useGetEventsQuery,
  useGetEventRegistrationsQuery,
  useLazyGetEventRegistrationsCSVQuery
} from '../../features/event/eventApi';

const EventRegistrations = () => {
  const [eventId, setEventId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Fetch events
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useGetEventsQuery();

  // Fetch registrations
  const { 
    data: registrations = [], 
    isLoading: registrationsLoading, 
    error: registrationsError,
    refetch: refetchRegistrations 
  } = useGetEventRegistrationsQuery(eventId, {
    skip: !eventId,
  });

  // CSV download
  const [downloadCSV, { isLoading: csvLoading }] = useLazyGetEventRegistrationsCSVQuery();

  // Error handling
  React.useEffect(() => {
    if (eventsError) toast.error(eventsError.message || 'Failed to load events');
    if (registrationsError) toast.error(registrationsError.message || 'Failed to load registrations');
  }, [eventsError, registrationsError]);

  const handleDownloadCSV = async () => {
    if (!eventId) return;
    
    try {
      const { data } = await downloadCSV(eventId);
      if (data) {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations_${eventId}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      toast.error('Failed to download CSV');
    }
  };

  // Filter events by search
  const filteredEvents = (eventsData?.events || []).filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase())
  );

  // Filter registrations by search
  const filteredRegistrations = React.useMemo(() => {
    if (!search) return registrations;
    return registrations.filter(reg =>
      (reg.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (reg.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (reg.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (reg.registration_code || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [search, registrations]);

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / PER_PAGE);
  const paginatedRegistrations = React.useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredRegistrations.slice(start, start + PER_PAGE);
  }, [filteredRegistrations, page]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8 my-4 sm:my-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">Event Registrations</h2>
      
      {/* Controls */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-80 text-sm"
        />
        
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-80 text-sm"
          disabled={eventsLoading}
        >
          <option value="">Select Event...</option>
          {filteredEvents.map((ev) => (
            <option key={ev.event_id} value={ev.event_id}>
              {ev.title}
            </option>
          ))}
        </select>
        
        <button
          onClick={refetchRegistrations}
          disabled={!eventId || registrationsLoading}
          className="bg-amber-600 text-white font-bold px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm"
        >
          {registrationsLoading ? 'Loading...' : 'Refresh'}
        </button>
        
        <button
          onClick={handleDownloadCSV}
          disabled={!eventId || csvLoading}
          className="bg-gray-900 text-white font-bold px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
        >
          {csvLoading ? 'Downloading...' : 'Download CSV'}
        </button>
      </div>

      {/* Loading State */}
      {registrationsLoading ? (
        <SimpleSpinner message="Loading registrations..." />
      ) : registrations.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-400">
          {eventId ? 'No registrations found for this event' : 'Please select an event'}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Registration Code</th>
                  <th className="p-3">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRegistrations.map((reg, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{reg.name}</td>
                    <td className="p-3 text-gray-700">{reg.email}</td>
                    <td className="p-3 text-gray-700">{reg.phone}</td>
                    <td className="p-3 text-gray-700">{reg.registration_code}</td>
                    <td className="p-3 text-gray-700">
                      {new Date(reg.registered_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card List */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedRegistrations.map((reg, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg shadow-sm p-4 bg-gray-50">
                <div className="font-semibold text-gray-900 text-base mb-1">{reg.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(reg.registered_at).toLocaleString()}
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div><span className="font-medium text-gray-700">Email:</span> {reg.email}</div>
                  <div><span className="font-medium text-gray-700">Phone:</span> {reg.phone}</div>
                  <div><span className="font-medium text-gray-700">Code:</span> {reg.registration_code}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded font-bold text-sm ${
                page === i + 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages} 
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;