import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetEventByIdQuery, useRegisterForEventMutation } from '../../features/event/eventApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faCheckCircle, 
  faLink,
  faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetail = () => {
  const { eventId } = useParams();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId);
  const [registerForEvent, { isLoading: regLoading }] = useRegisterForEventMutation();
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const isPast = event && new Date(event.end_time) < new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerForEvent({ event_id: eventId, ...form }).unwrap();
      setRegistered(true);
      toast.success('Registration successful! Check your email for details.');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading event..." />;
  if (isError || !event) return <div className="w-full text-center py-16 text-red-500">Event not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 mt-20 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {event.image_url && (
            <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  isPast ? 'bg-gray-400 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isPast ? 'Past Event' : 'Upcoming Event'}
                </span>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  event.event_type === 'virtual' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {event.event_type === 'virtual' ? 'Virtual' : 'Physical'}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>
              
              <div className="flex items-center gap-3 text-lg sm:text-xl text-gray-600 mb-6">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-amber-600" />
                <span>
                  {new Date(event.start_time).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              {event.event_type === 'physical' ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-600" />
                    Location
                  </h3>
                  <p className="text-lg text-gray-700 mb-3">{event.location_address}</p>
                  {event.location_map_url && (
                    <a 
                      href={event.location_map_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    >
                      <FontAwesomeIcon icon={faMapMarkedAlt} />
                      View on Google Maps →
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLink} className="text-blue-600" />
                    Virtual Meeting
                  </h3>
                  <a 
                    href={event.virtual_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors break-all"
                  >
                    {event.virtual_link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Section */}
        {event.title === "Doing Leadership Differently(DLD)" ? null : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {isPast ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Closed</h3>
                  <p className="text-gray-600">This event has already taken place.</p>
                </div>
              ) : registered ? (
                <AnimatePresence>
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-600" />
                      </motion.div>
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      Registration Successful!
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      Thank you for registering for this event.
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                    >
                      Check your email for event details and your registration code.
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Register for This Event</h3>
                    <p className="text-gray-600">Complete the form below to secure your spot.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" 
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" 
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Whatsapp number *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={form.phone} 
                          onChange={handleChange} 
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" 
                          placeholder="Enter your Whatsapp number"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <button 
                        type="submit" 
                        className="w-full bg-amber-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                        disabled={regLoading}
                      >
                        {regLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </span>
                        ) : (
                          'Register for Event'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
