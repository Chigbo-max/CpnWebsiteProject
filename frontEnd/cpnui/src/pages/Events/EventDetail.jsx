import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetEventByIdQuery, useRegisterForEventMutation } from '../../features/event/eventApi';

const EventDetail = () => {
  const { event_id } = useParams();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(event_id);
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
      await registerForEvent({ event_id, ...form }).unwrap();
      setRegistered(true);
      toast.success('Registration successful! Check your email for details.');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading event..." />;
  if (isError || !event) return <div className="w-full text-center py-16 text-red-500">Event not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <div className="mb-8">
        {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-4" />}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
        <div className="text-gray-600 mb-2">{new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</div>
        <div className="mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${isPast ? 'bg-gray-400 text-white' : 'bg-amber-600 text-white'}`}>{isPast ? 'Past Event' : 'Upcoming Event'}</span>
        </div>
        <div className="text-lg text-gray-700 mb-4">{event.description}</div>
        {event.event_type === 'physical' ? (
          <div className="mb-2">
            <div className="font-semibold">Location:</div>
            <div>{event.location_address}</div>
            {event.location_map_url && <a href={event.location_map_url} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">View on Google Maps</a>}
          </div>
        ) : (
          <div className="mb-2">
            <div className="font-semibold">Virtual Meeting Link:</div>
            <a href={event.virtual_link} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">{event.virtual_link}</a>
          </div>
        )}
      </div>
      {isPast ? (
        <div className="w-full text-center py-8 text-gray-500 text-xl font-semibold">Registration Closed</div>
      ) : registered ? (
        <div className="w-full text-center py-8 text-amber-600 text-xl font-semibold">Thank you for registering! Check your email for event details and your code.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Register for this Event</h3>
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={regLoading} className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50">
            {regLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EventDetail; 