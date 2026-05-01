import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    staff_id: "",
    name: "",
    email: "",
    password: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Users load nahi ho rahe. Login dobara karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      staff_id: "",
      name: "",
      email: "",
      password: "",
      is_active: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const updateData = {
          staff_id: form.staff_id,
          name: form.name,
          email: form.email,
          is_active: form.is_active,
        };

        if (form.password.trim()) {
          updateData.password = form.password;
        }

        await updateUser(editingId, updateData);
        setMessage("User update ho gaya ✅");
      } else {
        await createUser(form);
        setMessage("User create ho gaya ✅");
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      staff_id: user.staff_id || "",
      name: user.name || "",
      email: user.email || "",
      password: "",
      is_active: user.is_active ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap is user ko delete karna chahte ho?")) return;

    try {
      await deleteUser(id);
      setMessage("User delete ho gaya ✅");
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingId ? "Edit User" : "Add User"}
        </h2>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-3">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            name="staff_id"
            value={form.staff_id}
            onChange={handleChange}
            placeholder="Staff ID"
            className="border px-4 py-3 rounded-xl"
            required
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border px-4 py-3 rounded-xl"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder={editingId ? "New password optional" : "Password"}
            className="border px-4 py-3 rounded-xl"
            required={!editingId}
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
            {editingId ? "Update" : "Create"}
          </button>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Users Management</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-500 text-sm">
                  <th className="py-3">Staff ID</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3">{user.staff_id}</td>
                    <td className="py-3 font-medium text-gray-800">{user.name}</td>
                    <td className="py-3 text-gray-600">{user.email || "-"}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-5 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
