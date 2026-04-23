import React from "react";
import { Bell, Search } from "lucide-react";

export default function Topbar({ admin }) {
  return (
    <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-full max-w-md">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">{admin?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{admin?.role || "Super Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
