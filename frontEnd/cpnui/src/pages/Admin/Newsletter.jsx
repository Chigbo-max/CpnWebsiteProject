import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Newsletter = ({ token }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);

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
  const underlineCommand = {
    name: 'underline',
    icon: <u>U</u>,
    execute: (editor) => {
      const selection = editor.getSelection();
      const value = editor.getMdValue();
      const before = value.substring(0, selection.start);
      const selected = value.substring(selection.start, selection.end);
      const after = value.substring(selection.end);
      editor.setText(before + `<u>${selected || 'underline'}</u>` + after);
      if (!selected) {
        editor.setSelection({ start: selection.start + 3, end: selection.start + 12 });
      }
    }
  };
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
  const tableCommand = {
    name: 'table',
    icon: <span style={{ fontWeight: 'bold' }}>Tbl</span>,
    execute: (editor) => {
      const table = `| Head | Head |\n| --- | --- |\n| Data | Data |\n| Data | Data |\n| Data | Data |\n`;
      const selection = editor.getSelection();
      const value = editor.getMdValue();
      const before = value.substring(0, selection.start);
      const after = value.substring(selection.end);
      editor.setText(before + table + after);
      editor.setSelection({ start: before.length + 2, end: before.length + 6 });
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
          <MdEditor
            value={content}
            style={{ height: '400px' }}
            renderHTML={text => <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ u: ({node, ...props}) => <u {...props} />, span: ({node, ...props}) => <span {...props} /> }}>{text}</ReactMarkdown>}
            onChange={({ text }) => setContent(text)}
            onImageUpload={handleMdImageUpload}
            view={{ menu: true, md: true, html: true }}
            commands={['bold', 'italic', underlineCommand, colorCommand, tableCommand, 'strikethrough', 'link', 'image', 'ordered-list', 'unordered-list', 'code', 'quote']}
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
            <div className="prose prose-amber max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ u: ({node, ...props}) => <u {...props} />, span: ({node, ...props}) => <span {...props} /> }}>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Newsletter.propTypes = {
  token: PropTypes.string.isRequired
};

export default Newsletter; 