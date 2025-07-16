import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';

const EventRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    // Fetch all events for dropdown
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        setEvents(await res.json());
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/registrations`);
        console.log(res)

      if (!res.ok) throw new Error('Failed to fetch registrations');
      setRegistrations(await res.json());
    } catch (err) {
            console.error('Error fetching registrations:', err);

      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setCsvLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/registrations/csv`);
      if (!res.ok) throw new Error('Failed to download CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCsvLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line
  }, [eventId]);

  // Filter events by search
  const filteredEvents = events.filter(ev =>
    ev.title.toLowerCase().includes(search.toLowerCase())
  );

  const filtered = React.useMemo(() => {
    let data = registrations;
    if (search) {
      data = data.filter(reg =>
        (reg.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (reg.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (reg.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (reg.registration_code || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [search, registrations]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = React.useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8 my-4 sm:my-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">Event Registrations</h2>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-80 text-sm"
        />
        <select
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-80 text-sm"
        >
          <option value="">Select Event...</option>
          {filteredEvents.map(ev => (
            <option key={ev.event_id} value={ev.event_id}>{ev.title}</option>
          ))}
        </select>
        <button
          onClick={fetchRegistrations}
          disabled={!eventId}
          className="bg-amber-600 text-white font-bold px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm"
        >
          Load Registrations
        </button>
        <button
          onClick={handleDownloadCSV}
          disabled={!eventId || csvLoading}
          className="bg-gray-900 text-white font-bold px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
        >
          {csvLoading ? 'Downloading...' : 'Download CSV'}
        </button>
      </div>
      {loading ? (
        <SimpleSpinner message="Loading registrations..." />
      ) : registrations.length === 0 ? (
        <div className="w-full text-center py-8 text-gray-400">No registrations found.</div>
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
                {paginated.map((reg, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{reg.name}</td>
                    <td className="p-3 text-gray-700">{reg.email}</td>
                    <td className="p-3 text-gray-700">{reg.phone}</td>
                    <td className="p-3 text-gray-700">{reg.registration_code}</td>
                    <td className="p-3 text-gray-700">{new Date(reg.registered_at).toLocaleString()}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-400">No registrations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Card List */}
          <div className="md:hidden flex flex-col gap-4">
            {paginated.map((reg, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg shadow-sm p-4 bg-gray-50">
                <div className="font-semibold text-gray-900 text-base mb-1">{reg.name}</div>
                <div className="text-xs text-gray-500 mb-2">{new Date(reg.registered_at).toLocaleString()}</div>
                <div className="flex flex-col gap-1 text-sm">
                  <div><span className="font-medium text-gray-700">Email:</span> {reg.email}</div>
                  <div><span className="font-medium text-gray-700">Phone:</span> {reg.phone}</div>
                  <div><span className="font-medium text-gray-700">Code:</span> {reg.registration_code}</div>
                </div>
              </div>
            ))}
            {paginated.length === 0 && (
              <div className="p-6 text-center text-gray-400">No registrations found.</div>
            )}
          </div>
        </>
      )}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 text-sm">Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold text-sm ${page === i + 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50 text-sm">Next</button>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations; 