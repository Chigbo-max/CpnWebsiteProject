import React, { useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SimpleSpinner from '../../components/SimpleSpinner';


function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const EnrolleeManagement = ({ token }) => {
  const [enrollees, setEnrollees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchEnrollees = async () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/enrollments/admin/enrollments';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEnrollees(data.enrollments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollees();
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastStatus(null);
    try {
      const res = await fetch('http://localhost:5000/api/enrollments/admin/enrollments/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, content, startDate, endDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setBroadcastStatus({ type: 'success', message: data.message });
        setShowModal(false);
        setSubject('');
        setContent('');
      } else {
        setBroadcastStatus({ type: 'error', message: data.error });
      }
    } catch (err) {
      setBroadcastStatus({ type: 'error', message: 'Network error. Please try again.' });
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
      editor.setText(before + `<span style=\"color:red\">${selected || 'color'}</span>` + after);
      if (!selected) {
        editor.setSelection({ start: selection.start + 22, end: selection.start + 27 });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Enrollee Management</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-3 py-2" />
        </div>
        <button onClick={fetchEnrollees} className="bg-amber-600 text-white px-4 py-2 rounded mt-6 md:mt-0">Filter</button>
      </div>
      {loading ? (
        <SimpleSpinner message="Loading enrollees..." />
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Enrollment Date</th>
                <th className="px-4 py-2">Enrollment ID</th>
              </tr>
            </thead>
            <tbody>
              {enrollees.map((enrollee) => (
                <tr key={enrollee.enrollment_id} className="border-t">
                  <td className="px-4 py-2">{enrollee.name}</td>
                  <td className="px-4 py-2">{enrollee.email}</td>
                  <td className="px-4 py-2">{enrollee.course}</td>
                  <td className="px-4 py-2">{formatDate(enrollee.enrolled_at)}</td>
                  <td className="px-4 py-2">{enrollee.enrollment_id}</td>
                </tr>
              ))}
              {enrollees.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4">No enrollees found for selected period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-6 py-2 rounded mb-4">Send Mail</button>
      {broadcastStatus && (
        <div className={`mb-4 ${broadcastStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{broadcastStatus.message}</div>
      )}
      {/* Broadcast Modal with Editor */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Send Broadcast Email to Enrollees</h2>
            <form onSubmit={handleBroadcast} className="space-y-6">
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
                  style={{ height: '300px' }}
                  renderHTML={text => <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ u: ({node, ...props}) => <u {...props} />, span: ({node, ...props}) => <span {...props} /> }}>{text}</ReactMarkdown>}
                  onChange={({ text }) => setContent(text)}
                  view={{ menu: true, md: true, html: true }}
                  commands={['bold', 'italic', colorCommand, 'strikethrough', 'link', 'image', 'ordered-list', 'unordered-list', 'code', 'quote']}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 transition"
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
            {/* Preview Modal */}
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
        </div>
      )}
    </div>
  );
};

export default EnrolleeManagement; 