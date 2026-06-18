import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";

export default function Users() {
  const emptyForm = {
    staff_id: "",
    name: "",
    email: "",
    brc: "",
    district: "",
    aadhaar: "",
    mobile: "",
    station_id: "",
    password: "",
    joining_date: "",
    is_active: true,
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
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

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        staff_id: form.staff_id.trim(),
        name: form.name.trim(),
        email: form.email.trim() || null,
        brc: form.brc.trim() || null,
        district: form.district.trim() || null,
        aadhaar: form.aadhaar.trim() || null,
        mobile: form.mobile.trim() || null,
        station_id: form.station_id.trim() || null,
        joining_date: form.joining_date || null,
        is_active: form.is_active,
      };

      if (editingId) {
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }

        await updateUser(editingId, payload);
        setMessage("User Updated Successfully ✅");
      } else {
        payload.password = form.password.trim();

        await createUser(payload);
        setMessage("User Created Successfully ✅");
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
      brc: user.brc || "",
      district: user.district || "",
      aadhaar: user.aadhaar || "",
      mobile: user.mobile || "",
      station_id: user.station_id || "",
      password: "",
      joining_date: user.joining_date || "",
      is_active: user.is_active ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap is user ko delete karna chahte ho?")) return;

    try {
      setMessage("");
      setError("");
      await deleteUser(id);
      setMessage("User Deleted Successfully ✅");
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.detail || "Delete failed");
    }
  };

  const getBrcDistrictText = (user) => {
    const brc = user.brc || "-";
    const district = user.district || "-";
    return `${brc} [${district}]`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingId ? "Edit User" : "Add User"}
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-3">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3"
        >
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
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="brc"
            value={form.brc}
            onChange={handleChange}
            placeholder="BRC"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="District"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            placeholder="Aadhar No"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile No"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="station_id"
            value={form.station_id}
            onChange={handleChange}
            placeholder="Station ID"
            className="border px-4 py-3 rounded-xl"
          />

          <input
            name="joining_date"
            type="date"
            value={form.joining_date}
            onChange={handleChange}
            className="border px-4 py-3 rounded-xl"
            title="Joining Date"
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

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium px-4 py-3">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Users Management
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-500 text-sm">
                  <th className="py-3">Staff ID</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Brc[District]</th>
                  <th className="py-3">Joining Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Activity</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3">{user.staff_id}</td>

                    <td className="py-3 font-medium text-gray-800">
                      {user.name}
                    </td>

                    <td className="py-3 text-gray-600">
                      {getBrcDistrictText(user)}
                    </td>

                    <td className="py-3 text-gray-600">
                      {user.joining_date || "-"}
                    </td>

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

                    <td className="py-3">
                      <Link
                        to={`/users/${user.id}/analytics`}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        View
                      </Link>
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
                    <td colSpan="7" className="py-5 text-center text-gray-500">
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
