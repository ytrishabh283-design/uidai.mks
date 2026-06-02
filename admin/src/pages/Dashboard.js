import React, { useEffect, useState } from "react";
import { Users, UserCheck, AlertTriangle, IndianRupee, CalendarDays, BarChart3 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_staff: 0,
    active_staff: 0,
    eod_not_uploaded: 0,
    last_day_collection: 0,
    last_week_collection: 0,
    last_month_collection: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log("Dashboard load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Staff",
      value: stats.total_staff,
      icon: Users,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Total Active Staff",
      value: stats.active_staff,
      icon: UserCheck,
      color: "from-green-500 to-green-700",
    },
    {
      title: "EOD Not Uploaded",
      value: stats.eod_not_uploaded,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Last Day Collection",
      value: `₹${stats.last_day_collection}`,
      icon: IndianRupee,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Last Week Collection",
      value: `₹${stats.last_week_collection}`,
      icon: CalendarDays,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Last Month Collection",
      value: `₹${stats.last_month_collection}`,
      icon: BarChart3,
      color: "from-pink-500 to-rose-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-blue-100 mt-2">
          Staff, EOD aur collection ka quick overview
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow">
          Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`bg-gradient-to-br ${card.color} rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {card.title}
                    </p>
                    <h2 className="text-4xl font-bold mt-3">{card.value}</h2>
                  </div>

                  <div className="bg-white/20 p-4 rounded-2xl">
                    <Icon size={34} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
