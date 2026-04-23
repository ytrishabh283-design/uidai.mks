import React from "react";
import { Users, UserCheck, ClipboardList, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: <Users size={22} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Staff",
      value: "312",
      icon: <UserCheck size={22} />,
      color: "bg-green-500",
    },
    {
      title: "Total Reports",
      value: "89",
      icon: <ClipboardList size={22} />,
      color: "bg-orange-500",
    },
    {
      title: "Revenue",
      value: "₹45,800",
      icon: <IndianRupee size={22} />,
      color: "bg-purple-500",
    },
  ];

  const recentUsers = [
    { id: 1, name: "Rishabh Pathak", role: "Admin", status: "Active" },
    { id: 2, name: "Amit Kumar", role: "Manager", status: "Active" },
    { id: 3, name: "Rahul Singh", role: "Operator", status: "Inactive" },
    { id: 4, name: "Priya Sharma", role: "Staff", status: "Active" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{item.value}</h3>
            </div>
            <div className={`${item.color} text-white p-3 rounded-xl`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-500 text-sm">
                  <th className="py-3">Name</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-800 font-medium">{user.name}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">
              Add New User
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium">
              Create Report
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium">
              View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
