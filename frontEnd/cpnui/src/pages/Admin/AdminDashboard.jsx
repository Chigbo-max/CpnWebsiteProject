import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEnvelope, faUsers, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blog');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [blogPosts, setBlogPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', excerpt: '', slug: '' });
  const [newsletter, setNewsletter] = useState({ subject: '', content: '' });

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [postsRes, subsRes, inqRes] = await Promise.all([
        fetch('http://localhost:5000/api/blog'),
        fetch('http://localhost:5000/api/subscribers'),
        fetch('http://localhost:5000/api/admin/inquiries', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (postsRes.ok) setBlogPosts(await postsRes.json());
      if (subsRes.ok) setSubscribers(await subsRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const createBlogPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', excerpt: '', slug: '' });
        fetchData();
        toast.success('Blog post created successfully!');
      } else {
        toast.error('Failed to create blog post');
      }
    } catch (error) {
      toast.error('Error creating blog post');
    }
  };

  const sendNewsletter = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newsletter)
      });

      if (response.ok) {
        setNewsletter({ subject: '', content: '' });
        toast.success('Newsletter sent successfully!');
      } else {
        toast.error('Failed to send newsletter');
      }
    } catch (error) {
      toast.error('Error sending newsletter');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-amber-500 hover:text-amber-400 font-semibold"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'blog', label: 'Blog Posts', icon: faFileAlt },
            { id: 'subscribers', label: 'Subscribers', icon: faUsers },
            { id: 'inquiries', label: 'Contact Inquiries', icon: faEnvelope }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          {activeTab === 'blog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
                <button className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  New Post
                </button>
              </div>
              
              {/* Create New Post Form */}
              <form onSubmit={createBlogPost} className="mb-8 p-6 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Create New Blog Post</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Slug"
                    value={newPost.slug}
                    onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                    className="px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500"
                    required
                  />
                </div>
                <textarea
                  placeholder="Excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500 mb-4"
                  rows="2"
                />
                <textarea
                  placeholder="Content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500 mb-4"
                  rows="10"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
                >
                  Create Post
                </button>
              </form>

              {/* Blog Posts List */}
              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-gray-300 text-sm">{post.excerpt}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
                <span className="text-gray-300">Total: {subscribers.length}</span>
              </div>
              
              {/* Send Newsletter Form */}
              <form onSubmit={sendNewsletter} className="mb-8 p-6 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Send Newsletter</h3>
                <input
                  type="text"
                  placeholder="Subject"
                  value={newsletter.subject}
                  onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500 mb-4"
                  required
                />
                <textarea
                  placeholder="Content (HTML allowed)"
                  value={newsletter.content}
                  onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500 mb-4"
                  rows="8"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
                >
                  Send Newsletter
                </button>
              </form>

              {/* Subscribers List */}
              <div className="space-y-2">
                {subscribers.map(sub => (
                  <div key={sub.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-white">{sub.email}</p>
                      {sub.name && <p className="text-gray-300 text-sm">{sub.name}</p>}
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Inquiries</h2>
              <div className="space-y-4">
                {inquiries.map(inquiry => (
                  <div key={inquiry.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{inquiry.name}</h3>
                        <p className="text-gray-300">{inquiry.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        inquiry.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{inquiry.message}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 