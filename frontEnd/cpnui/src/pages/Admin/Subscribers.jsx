import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

// Remove demoSubscribers and related code

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [modalData, setModalData] = useState({ name: '', email: '', id: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subscribers from backend
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/subscribers');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      // The backend returns id, name, email, subscribed_at
      setSubscribers(data);
    } catch (err) {
      toast.error('Error fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filtered subscribers
  const filtered = useMemo(() => {
    if (!search) return subscribers;
    return subscribers.filter(s =>
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [search, subscribers]);

  // Bulk select
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map(s => s.id));
  };
  const toggleSelect = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };

  // Add/Edit Subscriber
  const openAddModal = () => {
    setModalMode('add');
    setModalData({ name: '', email: '', id: null });
    setShowModal(true);
  };
  const openEditModal = (sub) => {
    setModalMode('edit');
    setModalData({ name: sub.name || '', email: sub.email || '', id: sub.id });
    setShowModal(true);
  };
  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };
  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!modalData.name || !modalData.email) {
      toast.error('Name and email are required');
      return;
    }
    try {
      if (modalMode === 'add') {
        const res = await fetch('http://localhost:5000/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: modalData.name, email: modalData.email })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to add subscriber');
        }
        toast.success('Subscriber added');
      } else {
        const res = await fetch(`http://localhost:5000/api/subscribers/${modalData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: modalData.name, email: modalData.email })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to update subscriber');
        }
        toast.success('Subscriber updated');
      }
      setShowModal(false);
      await fetchSubscribers();
    } catch (err) {
      toast.error(err.message || 'Error saving subscriber');
    }
  };

  // Delete
  const openDeleteModal = (ids) => {
    setDeleteIds(Array.isArray(ids) ? ids : [ids]);
    setShowDeleteModal(true);
  };
  const handleDelete = async () => {
    try {
      for (const id of deleteIds) {
        // Find the subscriber by id to get the email
        const sub = subscribers.find(s => s.id === id);
        if (!sub) continue;
        const res = await fetch(`http://localhost:5000/api/subscribers/${encodeURIComponent(sub.email)}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete subscriber');
      }
      toast.success(deleteIds.length > 1 ? 'Subscribers deleted' : 'Subscriber deleted');
      setSelected(sel => sel.filter(id => !deleteIds.includes(id)));
      await fetchSubscribers(); // Refresh list after delete
    } catch (err) {
      toast.error('Error deleting subscriber(s)');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8">
      {loading && (
        <div className="w-full text-center py-8 text-gray-500">Loading subscribers...</div>
      )}
      {!loading && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Subscribers</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={openAddModal}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span className="hidden sm:inline">Add Subscriber</span>
              </button>
            </div>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="mb-4 flex items-center gap-4">
              <span className="text-sm text-gray-700">{selected.length} selected</span>
              <button
                onClick={() => openDeleteModal(selected)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Table (desktop) */}
          <div className="hidden md:block">
            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3"><input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleSelect(sub.id)} /></td>
                    <td className="p-3 font-medium text-gray-900">{sub.name}</td>
                    <td className="p-3 text-gray-700">{sub.email}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEditModal(sub)} className="text-amber-600 hover:text-amber-800"><FontAwesomeIcon icon={faEdit} /></button>
                      <button onClick={() => openDeleteModal(sub.id)} className="text-red-600 hover:text-red-800"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">No subscribers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="md:hidden flex flex-col gap-4">
            {filtered.map(sub => (
              <div key={sub.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleSelect(sub.id)} />
                  <span className="font-medium text-gray-900">{sub.name}</span>
                </div>
                <div className="text-gray-700 text-sm">{sub.email}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEditModal(sub)} className="text-amber-600 hover:text-amber-800"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => openDeleteModal(sub.id)} className="text-red-600 hover:text-red-800"><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-gray-400">No subscribers found.</div>
            )}
            {selected.length > 0 && (
              <button
                onClick={() => openDeleteModal(selected)}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors z-50"
              >
                Delete Selected ({selected.length})
              </button>
            )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{modalMode === 'add' ? 'Add Subscriber' : 'Edit Subscriber'}</h3>
                <form onSubmit={handleModalSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={modalData.name}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={modalData.email}
                      onChange={handleModalChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-amber-600 transition-all duration-300 hover:bg-amber-700 hover:border-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
                  >
                    {modalMode === 'add' ? 'Add Subscriber' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  onClick={() => setShowDeleteModal(false)}
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Delete Subscriber{deleteIds.length > 1 ? 's' : ''}?</h3>
                <p className="mb-6 text-gray-700">Are you sure you want to delete {deleteIds.length} subscriber{deleteIds.length > 1 ? 's' : ''}?</p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Subscribers; 