import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const upcoming = events.filter(ev => new Date(ev.end_time) >= now);
  const past = events.filter(ev => new Date(ev.end_time) < now);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-center">Events</h1>
      {loading ? (
        <div className="w-full text-center py-8 text-gray-500">Loading events...</div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Upcoming Events</h2>
            {upcoming.length === 0 ? (
              <div className="text-gray-400">No upcoming events.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map(ev => (
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
        </>
      )}
    </div>
  );
}

export default Events;
