import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        setEvents(await res.json());
      } catch (err) {
        // Optionally show a toast
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const filtered = React.useMemo(() => {
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

  const upcoming = filtered.filter(ev => new Date(ev.end_time) >= now);
  const past = filtered.filter(ev => new Date(ev.end_time) < now);

  // Pagination for upcoming events
  const totalPages = Math.ceil(upcoming.length / PER_PAGE);
  const paginatedUpcoming = React.useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return upcoming.slice(start, start + PER_PAGE);
  }, [upcoming, page]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-center">Events</h1>
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
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Upcoming Events</h2>
        {loading ? (
          <div className="w-full text-center py-8 text-gray-500">Loading events...</div>
        ) : paginatedUpcoming.length === 0 ? (
          <div className="text-gray-400">No upcoming events.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedUpcoming.map(ev => (
              <Link to={`/events/${ev.event_id}`} key={ev.event_id} className="block bg-gray-50 rounded-lg shadow p-6 hover:shadow-lg transition-all border border-gray-200">
                {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full h-40 object-cover rounded mb-4" />}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{ev.title}</h3>
                <div className="text-gray-600 mb-1">{new Date(ev.start_time).toLocaleString()} - {new Date(ev.end_time).toLocaleString()}</div>
                <div className="text-gray-700 mb-2">{ev.description?.slice(0, 100)}...</div>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-amber-600 text-white">Register</span>
              </Link>
            ))}
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
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Past Events</h2>
        {past.length === 0 ? (
          <div className="text-gray-400">No past events.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {past.map(ev => (
              <div key={ev.event_id} className="block bg-gray-50 rounded-lg shadow p-6 border border-gray-200 opacity-60">
                {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full h-40 object-cover rounded mb-4" />}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{ev.title}</h3>
                <div className="text-gray-600 mb-1">{new Date(ev.start_time).toLocaleString()} - {new Date(ev.end_time).toLocaleString()}</div>
                <div className="text-gray-700 mb-2">{ev.description?.slice(0, 100)}...</div>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-400 text-white">Event Ended</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
