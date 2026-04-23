import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "Rishabh Pathak", email: "rishabh@gmail.com", role: "Admin", status: "Active" },
    { id: 2, name: "Amit Kumar", email: "amit@gmail.com", role: "Manager", status: "Active" },
    { id: 3, name: "Rahul Singh", email: "rahul@gmail.com", role: "Operator", status: "Inactive" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await getUsers();
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        }
      } catch (error) {
        console.log("Users API not connected yet");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium">
          Add User
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-gray-500 text-sm">
                <th className="py-3">ID</th>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3">{user.id}</td>
                  <td className="py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="py-3 text-gray-600">{user.email}</td>
                  <td className="py-3 text-gray-600">{user.role}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
