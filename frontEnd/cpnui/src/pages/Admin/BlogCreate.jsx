import React, { useState } from 'react';
import { toast } from 'sonner';

const BlogCreate = ({ token, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');

  const EXCERPT_MAX_LENGTH = 200;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Auto-generate slug from title unless user edits slug manually
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (!slugEdited) {
      const generated = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  };
  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setSlugEdited(true);
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    if (!title || !content || !slug) {
      toast.error('Title, content, and slug are required');
      return;
    }
    setSubmitting(true);
    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('tags', tags);
      formData.append('status', publish ? 'published' : 'draft');
      if (image) formData.append('image', image);
      const response = await fetch('http://localhost:5000/api/admin/blog', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        setTitle('');
        setContent('');
        setExcerpt('');
        setTags('');
        setStatus('draft');
        setImage(null);
        setImagePreview(null);
        toast.success(publish ? 'Blog post published!' : 'Blog post saved as draft!');
        if (onSuccess) onSuccess();
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to create blog post');
      }
    } catch (error) {
      toast.error('Error creating blog post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Blog Post</h2>
      <form className="space-y-6" onSubmit={e => handleSubmit(e, status === 'published')} encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => {
              if (e.target.value.length <= EXCERPT_MAX_LENGTH) setExcerpt(e.target.value);
            }}
            rows={3}
            maxLength={EXCERPT_MAX_LENGTH}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
            placeholder="Short summary for preview..."
            required
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {excerpt.length} / {EXCERPT_MAX_LENGTH} characters
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 rounded-lg object-cover border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly)</label>
          <input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. my-first-blog-post"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. faith, career, leadership"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              className="form-radio text-amber-500"
            />
            <span className="ml-2 text-gray-700">Draft</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              className="form-radio text-amber-500"
            />
            <span className="ml-2 text-gray-700">Publish</span>
          </label>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
            onClick={e => handleSubmit(e, false)}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={submitting}
          >
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreate; 