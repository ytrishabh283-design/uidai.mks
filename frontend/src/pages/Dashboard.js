import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
<Link to="/dashboard/profile" className="flex items-center gap-3">
  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
    <User className="w-6 h-6 text-white" />
  </div>

  <div>
    <h2 className="text-white font-bold text-xl">UIDAI</h2>
    <p className="text-white/80 text-sm">Staff Portal</p>
  </div>
</Link>
import Home from './Home';
import Profile from './Profile';
import ECMPReport from './ECMPReport';
import UCReport from './UCReport';
import EODRequest from './EODRequest';
import MissingEOD from './MissingEOD';
import Wallet from './Wallet';

export default function Dashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UIDAI Staff Portal</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Staff ID: {user?.staff_id}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home user={user} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/ecmp-report" element={<ECMPReport user={user} />} />
            <Route path="/uc-report" element={<UCReport user={user} />} />
            <Route path="/eod-request" element={<EODRequest user={user} />} />
            <Route path="/missing-eod" element={<MissingEOD user={user} />} />
            <Route path="/wallet" element={<Wallet user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
