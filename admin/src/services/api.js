import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    staff_id: "",
    name: "",
    email: "",
    password: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Users load nahi ho rahe. Login dobara karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUsers();
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
    setMsg("");
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
        setMsg("User update ho gaya ✅");
      } else {
        await createUser(form);
        setMsg("User create ho gaya ✅");
      }

      resetForm();
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong");
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
    const ok = window.confirm("Kya aap is user ko delete karna chahte ho?");
    if (!ok) return;

    try {
      await deleteUser(id);
      setMsg("User delete ho gaya ✅");
      loadUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Update User" : "Create User"}
          </h2>

          {msg && <div className="bg-green-100 text-green-700 p-3 rounded mb-3">{msg}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="staff_id"
              value={form.staff_id}
              onChange={handleChange}
              placeholder="Staff ID"
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border px-4 py-3 rounded-lg"
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={editingId ? "New Password optional" : "Password"}
              type="password"
              className="w-full border px-4 py-3 rounded-lg"
              required={!editingId}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active User
            </label>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
              {editingId ? "Update User" : "Create User"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-500 text-white py-3 rounded-lg"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-4">All Users</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Staff ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-3">{user.staff_id}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email || "-"}</td>
                      <td className="p-3">
                        {user.is_active ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-5 text-center text-gray-500">
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
    </div>
  );
}
