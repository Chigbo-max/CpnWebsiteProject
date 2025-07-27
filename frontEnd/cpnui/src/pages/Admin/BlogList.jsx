import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuthErrorHandler } from '../../app/useAuthErrorHandler';
import {
  useGetBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from '../../features/blog/blogApi';

const BlogList = ({ onRefresh }) => {
  const { handleAuthError } = useAuthErrorHandler();
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  
  // Handle authentication errors
  if (error && handleAuthError(error)) {
    return null; // Exit early if authentication error was handled
  }

  const posts = useMemo(() => {
    return data?.blogs ?? [];
  }, [data]);

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.slug?.toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(post => post.status === statusFilter);
    }
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const startOfDay = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at);
        return postDate >= startOfDay && postDate < endOfDay;
      });
    }
    return filtered;
  }, [posts, searchTerm, statusFilter, dateFilter]);

  const handleDelete = (id) => {
    setDeletePostId(id);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;
    try {
      await deleteBlog(deletePostId).unwrap();
      toast.success('Blog post deleted');
      refetch();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete blog post');
    } finally {
      setDeletePostId(null);
    }
  };

  const handleEdit = (post) => {
    setEditPost({ ...post });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateBlog({ id: editPost.id, ...editPost }).unwrap();
      toast.success('Blog post updated');
      setEditPost(null);
      refetch();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update blog post');
    } finally {
      setEditLoading(false);
    }
  };

  const handleStatusToggle = (post) => {
    setEditPost({ ...post, status: post.status === 'published' ? 'draft' : 'published' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} className="text-sm" />
            Filters
          </button>
          {(searchTerm || statusFilter || dateFilter) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" 
                />
                <input
                  type="text"
                  placeholder="Search by title, content, or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Created</label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" 
                />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} posts
            {(searchTerm || statusFilter || dateFilter) && (
              <span className="ml-2">
                (filtered by {[
                  searchTerm && 'search',
                  statusFilter && 'status',
                  dateFilter && 'date'
                ].filter(Boolean).join(', ')})
              </span>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <SimpleSpinner message="Loading blog posts..." />
      ) : isError ? (
        <div className="text-center py-8 text-red-500">{error?.data?.message || error?.message || 'Error loading blog posts.'}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {posts.length === 0 ? 'No blog posts found.' : 'No posts match your search criteria.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map(post => (
                <tr key={post.id || post._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{post.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
                      onClick={() => setViewPost(post)}
                    >
                      View
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                      onClick={() => handleDelete(post.id || post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* View Modal */}
      {viewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setViewPost(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{viewPost.title}</h2>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Status:</span> {viewPost.status}</p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Date:</span> {viewPost.created_at ? new Date(viewPost.created_at).toLocaleString() : '-'}</p>
            <div className="mt-4">
              <p className="text-gray-900 whitespace-pre-line">{viewPost.content}</p>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setEditPost(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Blog Post</h2>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editPost.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={editPost.content}
                  onChange={handleEditChange}
                  rows={8}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <input
                  type="text"
                  name="excerpt"
                  value={editPost.excerpt}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={editPost.slug}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <button
                  type="button"
                  className={`px-4 py-1 rounded ${editPost.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} font-semibold text-xs`}
                  onClick={() => handleStatusToggle(editPost)}
                >
                  {editPost.status === 'published' ? 'Published' : 'Draft'} (Toggle)
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition ${editLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                  onClick={() => setEditPost(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Blog Post?</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                onClick={() => setDeletePostId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BlogList.propTypes = {
  token: PropTypes.string.isRequired,
  onRefresh: PropTypes.func
};

export default BlogList; 