import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import SimpleSpinner from '../../components/SimpleSpinner';
import { useGetEventsQuery } from '../../features/event/eventApi';

function Events() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { data, isLoading, isError, error } = useGetEventsQuery();
  const events = data?.events ?? [];

  console.log("events: ", events)

  const now = new Date();
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

  const upcoming = filtered.filter(ev => new Date(ev.end_time) >= now);
  const past = filtered.filter(ev => new Date(ev.end_time) < now);

  // Pagination for upcoming events
  const totalPages = Math.ceil(upcoming.length / PER_PAGE);
  const paginatedUpcoming = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return upcoming.slice(start, start + PER_PAGE);
  }, [upcoming, page]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(rgba(17, 24, 38, 0.9), rgba(17, 24, 38, 0.9)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.h1
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-400 mb-6"
          >
            Events
          </motion.h1>
          <motion.p
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed"
          >
            Join us at our upcoming events and connect with fellow professionals
            in our community. Discover opportunities for growth and networking.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Section */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full sm:w-80 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm"
              />
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Types</option>
                <option value="physical">Physical</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <section className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">Upcoming Events</h2>
            {isLoading ? (
              <SimpleSpinner message="Loading events..." />
            ) : isError ? (
              <div className="text-center py-12 text-red-400">{error?.data?.message || error?.message || 'Error loading events.'}</div>
            ) : paginatedUpcoming.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No upcoming events</h3>
                <p className="text-gray-500">Check back soon for new events!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedUpcoming.map(ev => (
                  ev.event_id &&(
                  <motion.div
                    key={ev.event_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 overflow-hidden"
                  >
                    <Link to={`/events/${ev.event_id}`} className="block">
                      {ev.image_url ? (
                        <div className="aspect-video bg-gray-200">
                          <img 
                            src={ev.image_url} 
                            alt={ev.title} 
                            className="w-full h-full object-cover"
                            onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-white" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            ev.event_type === 'virtual' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {ev.event_type === 'virtual' ? 'Virtual' : 'Physical'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{ev.title}</h3>
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="text-amber-500" />
                            <span>{new Date(ev.start_time).toLocaleDateString()} at {new Date(ev.start_time).toLocaleTimeString()}</span>
                          </div>
                          {ev.location_address && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-500" />
                              <span className="line-clamp-1">{ev.location_address}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-3">{ev.description?.slice(0, 120)}...</p>
                        <div className="flex justify-between items-center">
                          <span className="inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors">
                            Register Now
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  )
                ))}
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)} 
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      page === i + 1 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages} 
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          {/* Past Events Section */}
          {past.length > 0 && (
            <section>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {past.map(ev => (
                  <div key={ev.event_id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden opacity-75">
                    {ev.image_url ? (
                      <div className="aspect-video bg-gray-200">
                        <img 
                          src={ev.image_url} 
                          alt={ev.title} 
                          className="w-full h-full object-cover"
                          onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-white" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          {ev.event_type === 'virtual' ? 'Virtual' : 'Physical'}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          Ended
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{ev.title}</h3>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                          <span>{new Date(ev.start_time).toLocaleDateString()}</span>
                        </div>
                        {ev.location_address && (
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />
                            <span className="line-clamp-1">{ev.location_address}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-3">{ev.description?.slice(0, 120)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
