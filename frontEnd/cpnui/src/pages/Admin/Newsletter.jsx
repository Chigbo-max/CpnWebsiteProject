import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-richtexteditor/styles/material.css';

const Newsletter = ({ token }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const rteRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !content) {
      toast.error('Subject and content are required');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, content })
      });
      if (!res.ok) throw new Error('Failed to send newsletter');
      toast.success('Newsletter sent to all subscribers!');
      setSubject('');
      setContent('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Newsletter</h2>
      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
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
        {/* Button group using Tailwind */}
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
            onClick={() => setPreviewOpen(true)}
            disabled={sending}
          >
            Preview
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Newsletter'}
          </button>
        </div>
      </form>
      {/* Custom Modal for Preview */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{subject}</h2>
            <div className="prose prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter; 