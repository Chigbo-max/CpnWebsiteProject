import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import { useAdminAuth } from '../../app/useAdminAuth';

const Profile = ({ admin, onUpdate, showChangePassword, setShowChangePassword }) => {
  const [form, setForm] = useState({
    name: admin?.username || '',
    email: admin?.email || '',
    profilePic: admin?.profile_pic || '',
    uploading: false,
    saving: false,
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changing, setChanging] = useState(false);
  const { updateAdmin } = useAdminAuth();

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, uploading: true }));
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      // Upload image to backend, not directly to Cloudinary
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiBaseUrl}/api/admin/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      const data = await res.json();
      setForm(f => ({ ...f, profilePic: data.url, uploading: false }));
      // Instantly update profile on server as soon as image is uploaded
      const response = await fetch(`${apiBaseUrl}/api/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: form.name, email: form.email, profilePic: data.url }),
      });
      if (response.ok) {
        const updatedAdmin = await response.json();
        onUpdate({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic }); // update context/state instantly
        updateAdmin({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic }); // update context and localStorage for navbar/sidebar
        toast.success('Profile picture updated!');
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch {
      setForm(f => ({ ...f, uploading: false }));
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm(f => ({ ...f, saving: true }));
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiBaseUrl}/api/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: form.name, email: form.email, profilePic: form.profilePic }),
      });
      if (response.ok) {
        const updatedAdmin = await response.json();
        onUpdate({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic }); 
        updateAdmin({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic }); // update context and localStorage for navbar/sidebar
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Error updating profile');
    } finally {
      setForm(f => ({ ...f, saving: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setChanging(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      if (response.ok) {
        toast.success('Password changed successfully!');
        setShowChangePassword(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error('Failed to change password');
      }
    } catch {
      toast.error('Error changing password');
    } finally {
      setChanging(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    setForm(f => ({ ...f, uploading: true }));
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${apiBaseUrl}/api/admin/profile-picture`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const updatedAdmin = await response.json();
        setForm(f => ({ ...f, profilePic: '', uploading: false }));
        onUpdate({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic });
        updateAdmin({ ...updatedAdmin, profilePic: updatedAdmin.profile_pic });
        toast.success('Profile picture removed!');
      } else {
        setForm(f => ({ ...f, uploading: false }));
        toast.error('Failed to remove profile picture');
      }
    } catch {
      setForm(f => ({ ...f, uploading: false }));
      toast.error('Failed to remove profile picture');
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="flex flex-col items-center gap-4">
          <img
            src={form.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'Admin') + '&background=111827&color=fff&size=128'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-500"
          />
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Change Profile Picture</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 mt-2"
              onChange={handleImageChange}
              disabled={form.uploading}
            />
          </label>
          {form.profilePic && (
            <button
              type="button"
              className="mt-2 text-xs text-red-600 underline hover:text-red-800"
              onClick={handleRemoveProfilePic}
              disabled={form.uploading}
            >
              Remove Profile Picture
            </button>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            required
            disabled
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
          disabled={form.uploading || form.saving}
        >
          {form.uploading ? 'Uploading...' : form.saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowChangePassword(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                disabled={changing}
              >
                {changing ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  admin: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
    profile_pic: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
  showChangePassword: PropTypes.bool.isRequired,
  setShowChangePassword: PropTypes.func.isRequired,
};

export default Profile; 