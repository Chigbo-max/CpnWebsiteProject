import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import SimpleSpinner from '../../components/SimpleSpinner';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  useGetInquiriesQuery,
  useDeleteInquiryMutation,
  useUpdateInquiryStatusMutation,
  useRespondInquiryMutation,
} from '../../features/contact/contactApi';

const ContactInquiries = () => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [responseSending, setResponseSending] = useState(false);
  const [previewResponse, setPreviewResponse] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetInquiriesQuery();
  const inquiries = Array.isArray(data) ? data : [];
  const [deleteInquiry] = useDeleteInquiryMutation();
  const [updateInquiryStatus] = useUpdateInquiryStatusMutation();
  const [respondInquiry] = useRespondInquiryMutation();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteInquiry(id).unwrap();
      toast.success('Inquiry deleted');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete inquiry');
    }
  };

  const handleMark = async (id, status) => {
    try {
      await updateInquiryStatus({ id, status }).unwrap();
      toast.success('Status updated');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const filtered = useMemo(() => {
    let data = inquiries;
    if (search) {
      data = data.filter(inq =>
        (inq.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (inq.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (inq.message || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter(inq => (inq.status || 'unread') === statusFilter);
    }
    return data;
  }, [search, statusFilter, inquiries]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const handleMdImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result;
          resolve(base64);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
  const handleSendResponse = async () => {
    if (!selected || !responseContent) return;
    setResponseSending(true);
    try {
      await respondInquiry({ id: selected.id || selected._id, admin_response: responseContent }).unwrap();
      toast.success('Response sent via email!');
      setRespondModalOpen(false);
      setResponseContent('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send response');
    } finally {
      setResponseSending(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-2 py-2 rounded-lg border border-gray-300"
          >
            <option value="">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <SimpleSpinner message="Loading inquiries..." />
      ) : isError ? (
        <div className="text-center py-8 text-red-500">{error?.data?.message || error?.message || 'Error loading inquiries.'}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No inquiries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map(inq => (
                <tr key={inq.id || inq._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{inq.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700">{inq.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inq.message.slice(0, 40)}{inq.message.length > 40 ? '...' : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inq.created_at ? new Date(inq.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${inq.status === 'responded' ? 'bg-green-100 text-green-700' : inq.status === 'read' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{inq.status || 'unread'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
                      onClick={() => { setSelected(inq); setModalOpen(true); }}
                    >
                      View
                    </button>
                    {inq.status !== 'read' && (
                      <button
                        className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold"
                        onClick={() => handleMark(inq.id || inq._id, 'read')}
                      >
                        Mark as Read
                      </button>
                    )}
                    {inq.status !== 'responded' && (
                      <button
                        className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                        onClick={() => handleMark(inq.id || inq._id, 'responded')}
                      >
                        Mark as Responded
                      </button>
                    )}
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold"
                      onClick={() => handleDelete(inq.id || inq._id)}
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
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Next</button>
        </div>
      )}
      {/* Modal for viewing full inquiry */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Email:</span> {selected.email}</p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-semibold">Date:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}</p>
            <div className="mt-4">
              <p className="text-gray-900 whitespace-pre-line">{selected.message}</p>
            </div>
            <div className="flex gap-2 mt-6">
              {selected.status !== 'read' && (
                <button
                  className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold"
                  onClick={() => { handleMark(selected.id || selected._id, 'read'); setModalOpen(false); }}
                >
                  Mark as Read
                </button>
              )}
              {selected.status !== 'responded' && (
                <button
                  className="px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                  onClick={() => { handleMark(selected.id || selected._id, 'responded'); setModalOpen(false); }}
                >
                  Mark as Responded
                </button>
              )}
              <button
                className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 text-xs font-semibold"
                onClick={() => { setRespondModalOpen(true); setResponseContent(''); }}
              >
                Respond
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Respond Modal */}
      {respondModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setRespondModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Respond to {selected?.name}</h2>
            <MdEditor
              value={responseContent}
              style={{ height: '250px' }}
              renderHTML={text => <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ u: ({node, ...props}) => <u {...props} />, span: ({node, ...props}) => <span {...props} /> }}>{text}</ReactMarkdown>}
              onChange={({ text }) => setResponseContent(text)}
              onImageUpload={handleMdImageUpload}
              view={{ menu: true, md: true, html: true }}
              commands={['bold', 'italic', colorCommand, 'strikethrough', 'link', 'image', 'ordered-list', 'unordered-list', 'code', 'quote']}
            />
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                onClick={() => setRespondModalOpen(false)}
                disabled={responseSending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 font-semibold"
                onClick={handleSendResponse}
                disabled={responseSending}
              >
                {responseSending ? 'Sending...' : 'Send Response'}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                onClick={() => setPreviewResponse(p => !p)}
              >
                {previewResponse ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
            {previewResponse && (
              <div className="prose prose-amber max-w-none mt-4 p-4 border rounded bg-gray-50">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ u: ({node, ...props}) => <u {...props} />, span: ({node, ...props}) => <span {...props} /> }}>{responseContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ContactInquiries.propTypes = {
  token: PropTypes.string
};

export default ContactInquiries; 