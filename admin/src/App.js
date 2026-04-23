import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  IndianRupee,
  UserCheck,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const users = [
    { id: 1, name: "Rishabh Pathak", role: "Admin", status: "Active" },
    { id: 2, name: "Amit Kumar", role: "Manager", status: "Active" },
    { id: 3, name: "Rahul Singh", role: "Operator", status: "Inactive" },
    { id: 4, name: "Priya Sharma", role: "Staff", status: "Active" },
  ];

  const reports = [
    { id: 1, name: "Daily Collection Report", date: "23-04-2026", status: "Completed" },
    { id: 2, name: "Staff Performance Report", date: "22-04-2026", status: "Pending" },
    { id: 3, name: "Transaction Summary", date: "21-04-2026", status: "Completed" },
  ];

  const renderDashboard = () => (
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
                {users.map((user) => (
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

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium">
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-gray-500 text-sm">
              <th className="py-3">ID</th>
              <th className="py-3">Name</th>
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
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium">
          Generate Report
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{report.name}</h3>
              <p className="text-sm text-gray-500">Date: {report.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {report.status}
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm border p-5 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">Settings</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
          <input
            type="text"
            placeholder="Enter admin name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
          <input
            type="password"
            placeholder="New password"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { key: "users", label: "Users", icon: <Users size={20} /> },
    { key: "reports", label: "Reports", icon: <FileText size={20} /> },
    { key: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className={`${sidebarOpen ? "block" : "hidden"} font-bold text-xl`}>
            Admin Panel
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-800">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activePage === item.key
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-full max-w-md">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search here..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {activePage === "dashboard" && renderDashboard()}
          {activePage === "users" && renderUsers()}
          {activePage === "reports" && renderReports()}
          {activePage === "settings" && renderSettings()}
        </main>
      </div>
    </div>
  );
}
