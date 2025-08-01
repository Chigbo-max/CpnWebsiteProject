import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminAuth } from '../../app/useAdminAuth';

const initialState = {
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  event_type: 'physical',
  location_address: '',
  location_map_url: '',
  virtual_link: '',
  image: null,
  image_url: '',
};

const EventEdit = () => {
  const { event_id } = useParams();
  const [form, setForm] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/events/${event_id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch event (${res.status})`);
        }
        const data = await res.json();
        setForm({ ...data, image: null, image_url: data.image_url || '' });
        setImagePreview(data.image_url || null);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error(error.message || 'Error fetching event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [event_id, apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleTypeChange = (e) => {
    setForm(f => ({ ...f, event_type: e.target.value, location_address: '', location_map_url: '', virtual_link: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageBase64 = null;
      if (form.image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(form.image);
        });
      }
      const payload = {
        ...form,
        image: imageBase64,
      };
      const res = await fetch(`${apiBaseUrl}/events/${event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update event');
      }
      toast.success('Event updated!');
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.message || 'Error updating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Event Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg min-h-[100px]" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Start Date & Time</label>
            <input type="datetime-local" name="start_time" value={form.start_time?.slice(0,16)} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">End Date & Time</label>
            <input type="datetime-local" name="end_time" value={form.end_time?.slice(0,16)} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Event Type</label>
          <select name="event_type" value={form.event_type} onChange={handleTypeChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="physical">Physical</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        {form.event_type === 'physical' ? (
          <>
            <div>
              <label className="block font-semibold mb-1">Location Address</label>
              <input type="text" name="location_address" value={form.location_address} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Google Map URL</label>
              <input type="url" name="location_map_url" value={form.location_map_url} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </>
        ) : (
          <div>
            <label className="block font-semibold mb-1">Virtual Meeting Link</label>
            <input type="url" name="virtual_link" value={form.virtual_link} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>
        )}
        <div>
          <label className="block font-semibold mb-1">Event Image</label>
          <input type="file" accept="image/*" onChange={handleChange} className="w-full" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg border" />}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EventEdit; 