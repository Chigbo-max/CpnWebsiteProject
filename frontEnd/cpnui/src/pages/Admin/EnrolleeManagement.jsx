import { useEffect, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import SimpleSpinner from '../../components/SimpleSpinner';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  useGetEnrollmentsQuery,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useBroadcastToEnrollmentsMutation,
} from '../../features/admin/enrollmentApi';

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

const EnrolleeManagement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Edit and Delete states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    course: '',
    whatsapp: '',
  });

  // API hooks
  const { data: enrollmentsData, isLoading, refetch } = useGetEnrollmentsQuery({ startDate, endDate });
  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();
  const [deleteEnrollment, { isLoading: isDeleting }] = useDeleteEnrollmentMutation();
  const [broadcastToEnrollments, { isLoading: isBroadcasting }] = useBroadcastToEnrollmentsMutation();

  const enrollments = enrollmentsData?.enrollments || [];

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastStatus(null);
    try {
      await broadcastToEnrollments({ subject, content, startDate, endDate }).unwrap();
      setBroadcastStatus({ type: 'success', message: `Broadcast sent to ${enrollments.length} enrollees.` });
      setShowModal(false);
      setSubject('');
      setContent('');
    } catch (error) {
      setBroadcastStatus({ type: 'error', message: error.data?.error || 'Network error. Please try again.' });
    }
  };

  const handleEditClick = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEditForm({
      name: enrollment.name,
      email: enrollment.email,
      course: enrollment.course,
      whatsapp: enrollment.whatsapp || '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEnrollment({
        enrollment_id: editingEnrollment.enrollment_id,
        ...editForm,
      }).unwrap();
      
      toast.success('Enrollment updated successfully');
      setShowEditModal(false);
      setEditingEnrollment(null);
      setEditForm({ name: '', email: '', course: '', whatsapp: '' });
    } catch (error) {
      toast.error(error.data?.error || 'Failed to update enrollment');
    }
  };

  const handleDeleteClick = (enrollment) => {
    setDeletingEnrollment(enrollment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEnrollment(deletingEnrollment.enrollment_id).unwrap();
      toast.success('Enrollment deleted successfully');
      setShowDeleteModal(false);
      setDeletingEnrollment(null);
    } catch (error) {
      toast.error(error.data?.error || 'Failed to delete enrollment');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingEnrollment(null);
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
        <button onClick={() => refetch()} className="bg-amber-600 text-white px-4 py-2 rounded mt-6 md:mt-0">Filter</button>
      </div>
      {isLoading ? (
        <SimpleSpinner message="Loading enrollees..." />
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">WhatsApp</th>
                <th className="px-4 py-2">Enrollment Date</th>
                <th className="px-4 py-2">Enrollment ID</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.enrollment_id} className="border-t">
                  <td className="px-4 py-2">{enrollment.name}</td>
                  <td className="px-4 py-2">{enrollment.email}</td>
                  <td className="px-4 py-2">{enrollment.course}</td>
                  <td className="px-4 py-2">{enrollment.whatsapp || '-'}</td>
                  <td className="px-4 py-2">{formatDate(enrollment.enrolled_at)}</td>
                  <td className="px-4 py-2">{enrollment.enrollment_id}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(enrollment)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                        title="Edit Enrollment"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(enrollment)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                        title="Delete Enrollment"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4">No enrollees found for selected period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-6 py-2 rounded mb-4">Send Mail</button>
      {broadcastStatus && (
        <div className={`mb-4 ${broadcastStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{broadcastStatus.message}</div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Enrollment</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={editForm.course}
                  onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                >
                  <option value="">Select a course</option>
                  <option value="Doing Business Differently">Doing Business Differently</option>
                  <option value="Doing Leadership Differently">Doing Leadership Differently</option>
                  <option value="Doing Work Differently">Doing Work Differently</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={editForm.whatsapp}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Enrollment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Enrollment</h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this enrollment?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">{deletingEnrollment.name}</h4>
                <p className="text-sm text-red-700">
                  Course: {deletingEnrollment.course}
                </p>
                <p className="text-sm text-red-700">
                  Email: {deletingEnrollment.email}
                </p>
                <p className="text-sm text-red-700 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Enrollment'
                )}
              </button>
            </div>
          </div>
        </div>
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
                  renderHTML={text => <ReactMarkdown components={{ span: ({...props}) => <span {...props} /> }}>{text}</ReactMarkdown>}
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
                  disabled={isBroadcasting}
                  className="px-6 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {isBroadcasting ? 'Sending...' : 'Send Broadcast'}
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
                    <ReactMarkdown components={{ span: ({...props}) => <span {...props} /> }}>{content}</ReactMarkdown>
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

