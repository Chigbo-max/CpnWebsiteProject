import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import "../../styles/react-mde-all.css";
import { Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { useCallback, useRef } from "react";
import { HexColorPicker } from 'react-colorful';
import { Modifier, RichUtils, AtomicBlockUtils, ContentState, convertFromRaw } from 'draft-js';
import remarkGfm from 'remark-gfm';
import { useCreateBlogMutation } from '../../features/blog/blogApi';

const BlogCreate = ({ token, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [markdownValue, setMarkdownValue] = useState("");
  const [status, setStatus] = useState('draft');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#000000');
  const fileInputRef = useRef();
  const [showClearModal, setShowClearModal] = useState(false);
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    slug: '',
    featuredImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [createBlog] = useCreateBlogMutation();

  const EXCERPT_MAX_LENGTH = 200;
  const imageInputRef = useRef();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', markdownValue);
      formData.append('excerpt', excerpt);
      formData.append('tags', tags);
      formData.append('status', status);
      formData.append('slug', slug);
      if (image) {
        formData.append('image', image);
      }
      const result = await createBlog(formData).unwrap();
      toast.success('Blog post created successfully!');
      onSuccess && onSuccess();
      setTitle('');
      setMarkdownValue('');
      setExcerpt('');
      setStatus('draft');
      setImage(null);
      setImagePreview(null);
      setTags('');
      setSlug('');
      setSlugEdited(false);
    } catch (err) {
      if (err?.data?.error === 'DUPLICATE_SLUG') {
        toast.error('A blog post with this slug already exists. Please choose a different slug.');
        setError('Please choose a different slug for your blog post.');
      } else if (err?.data?.error === 'DATABASE_ERROR') {
        toast.error('Database error occurred. Please check your input and try again.');
        setError('Please check your input and try again.');
      } else {
        toast.error(err?.data?.message || 'Failed to create blog post');
        setError(err?.data?.message || 'An error occurred while creating the blog post.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Markdown editor image upload handler for react-markdown-editor-lite
  const handleMdImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result;
          const res = await fetch("/api/admin/blog/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ image: base64 })
          });
          const data = await res.json();
          if (data.url && !data.url.includes('placeholder-event.png')) resolve(data.url);
          else reject(new Error("Image upload failed. Please try again."));
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRichTextImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const res = await fetch('/api/admin/blog/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: base64 })
        });
        const data = await res.json();
        if (data.url) {
          const contentState = EditorState.getCurrentContent(); 
          const contentStateWithEntity = ContentState.createEntity('IMAGE', 'IMMUTABLE', { src: data.url }); 
          const entityKey = ContentState.getLastCreatedEntityKey(); 
          const newState = AtomicBlockUtils.insertAtomicBlock( 
            EditorState.set(EditorState.getCurrentContent(), { currentContent: contentStateWithEntity }), 
            entityKey, 
            ' ' 
          ); 
          setRichTextState(newState); 
        }
      } catch (e) {
        toast.error('Image upload failed');
      }
    };
    reader.readAsDataURL(file);
  };
  // Color picker for Draft.js
  const applyColor = (color) => {
    const newState = RichUtils.toggleInlineStyle(EditorState.getCurrentContent(), `COLOR-${color}`); 
    setRichTextState(newState); 
  };
  // Custom block renderer for images
  const blockRendererFn = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: ImageBlock,
        editable: false,
      };
    }
    return null;
  };
  function ImageBlock(props) {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();
    return <img src={src} alt="uploaded" style={{ maxWidth: '100%', margin: '12px 0' }} />;
  }

  // Custom toolbar commands for underline and color
  const colorCommand = {
    name: 'color',
    icon: <span style={{ color: 'red', fontWeight: 'bold' }}>A</span>,
    execute: (editor) => {
      const selection = editor.getSelection();
      const value = editor.getMdValue();
      const before = value.substring(0, selection.start);
      const selected = value.substring(selection.start, selection.end);
      const after = value.substring(selection.end);
      editor.setText(before + `<span style="color:red">${selected || 'color'}</span>` + after);
      if (!selected) {
        editor.setSelection({ start: selection.start + 22, end: selection.start + 27 });
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Blog Post</h2>
      <form className="space-y-6" onSubmit={e => handleSubmit(e)} encType="multipart/form-data">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Markdown Content</label>
          <MdEditor
            value={markdownValue}
            style={{ height: '400px' }}
            renderHTML={text => <ReactMarkdown components={{ span: ({node, ...props}) => <span {...props} /> }}>{text}</ReactMarkdown>}
            onChange={({ text }) => setMarkdownValue(text)}
            onImageUpload={handleMdImageUpload}
            view={{ menu: true, md: true, html: true }}
            commands={['bold', 'italic', colorCommand, 'strikethrough', 'link', 'image', 'ordered-list', 'unordered-list', 'code', 'quote']}
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
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
            onClick={() => setShowClearModal(true)}
            disabled={submitting}
          >
            {submitting ? 'Clearing...' : 'Clear'}
          </button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-amber-600">Clear All Fields?</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to clear all fields? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 font-semibold"
                onClick={() => {
                  setTitle('');
                  setMarkdownValue('');
                  setExcerpt('');
                  setStatus('draft');
                  setImage(null);
                  setImagePreview(null);
                  setTags('');
                  setShowClearModal(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BlogCreate.propTypes = {
  token: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default BlogCreate; 