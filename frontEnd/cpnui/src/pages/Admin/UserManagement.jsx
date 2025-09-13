import { useState } from "react";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useExportUsersPdfQuery,
} from "../../features/admin/userManagementApi";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, FileDown } from "lucide-react";

const UserManagement = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const { data: stats } = useGetUserStatsQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { refetch: exportUsersPdf } = useExportUsersPdfQuery(undefined, {
    skip: true,
  });

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null); // store user id for delete modal

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      ...user,
      dateOfBirth: user.dateOfBirth || { day: "", month: "" },
    });
  };

  const handleSave = async () => {
    if (!formData.dateOfBirth?.day || !formData.dateOfBirth?.month) {
      toast.error("Day and month of birth are required");
      return;
    }

    try {
      await updateUser({ id: editingUser._id, ...formData }).unwrap();
      toast.success("User updated successfully");
      setEditingUser(null);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteTarget).unwrap();
      toast.success("User deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportUsersPdf().unwrap();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch {
      toast.error("Failed to export PDF");
    }
  };

  const formatDate = (dob) => {
    if (!dob) return "-";
    if (dob.day && dob.month) {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return `${dob.day} ${monthNames[dob.month - 1]}`;
    }
    return "-";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load users</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-gray-500">Inactive Users</h3>
            <p className="text-2xl font-bold">{stats.inactiveUsers}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          <FileDown size={18} />
          Export PDF
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Nationality</th>
              <th className="p-3">State</th>
              <th className="p-3">DOB</th>
              <th className="p-3">Industry</th>
              <th className="p-3">Occupation</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user) => (
              <tr key={user._id} className="border-t text-sm">
                <td className="p-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.whatsapp}</td>
                <td className="p-3">{user.nationality}</td>
                <td className="p-3">{user.state}</td>
                <td className="p-3">{formatDate(user.dateOfBirth)}</td>
                <td className="p-3">{user.industry || "-"}</td>
                <td className="p-3">{user.occupation || "-"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <div className="space-y-3">
              {[
                "firstName",
                "lastName",
                "email",
                "whatsapp",
                "nationality",
                "state",
                "industry",
                "occupation",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-600 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

              {/* DOB (Day + Month) */}
              <div>
                <label className="block text-sm text-gray-600">
                  Date of Birth
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.dateOfBirth?.day || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: {
                          ...formData.dateOfBirth,
                          day: e.target.value,
                        },
                      })
                    }
                    className="w-1/2 border p-2 rounded"
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.dateOfBirth?.month || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: {
                          ...formData.dateOfBirth,
                          month: e.target.value,
                        },
                      })
                    }
                    className="w-1/2 border p-2 rounded"
                  >
                    <option value="">Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, i) => (
                      <option key={month} value={i + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default UserManagement;
