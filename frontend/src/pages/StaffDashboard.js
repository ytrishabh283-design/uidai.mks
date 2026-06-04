import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  ReceiptText,
  BadgeIndianRupee,
  Activity,
  Target,
  BarChart3,
} from "lucide-react";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_URL ||
  "https://staff-system-51i3.onrender.com";

const API = `${BACKEND_URL}/api`;

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function StatCard({ title, value, icon: Icon, tone }) {
  const tones = {
    blue: { icon: "text-blue-600 bg-blue-50", value: "text-blue-700" },
    red: { icon: "text-red-600 bg-red-50", value: "text-red-700" },
    green: { icon: "text-green-600 bg-green-50", value: "text-green-700" },
    purple: { icon: "text-purple-600 bg-purple-50", value: "text-purple-700" },
    pink: { icon: "text-pink-600 bg-pink-50", value: "text-pink-700" },
  };

  const selectedTone = tones[tone] || tones.blue;

  return (
    <div className="rounded-3xl p-5 bg-white shadow-sm border border-blue-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-semibold">{title}</p>
          <h3 className={`text-3xl font-bold mt-2 ${selectedTone.value}`}>{value}</h3>
        </div>
        <div className={`${selectedTone.icon} p-3 rounded-2xl`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

function WeeklyEnrollmentChart({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const maxTotal = Math.max(...data.map((item) => Number(item.total || 0)), 1);

  const colors = [
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-purple-500 to-violet-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-rose-700",
    "from-cyan-500 to-sky-700",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Weekly Enrollment Chart
      </h3>

      <div className="relative h-80 flex items-end gap-5 px-2 pt-8 pb-8 border-b border-gray-200">
        {data.map((item, index) => {
          const height = Math.max(12, Math.round((Number(item.total || 0) / maxTotal) * 230));
          const active = hoveredDay === item.day;

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center justify-end relative"
              onMouseEnter={() => setHoveredDay(item.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {active && (
                <div className="absolute bottom-full mb-2 z-20 w-32 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white p-2 shadow-xl text-[10px] leading-tight">
                  <p className="font-bold mb-1">{item.day}</p>
                  <div className="space-y-0.5">
                    <p>New: <span className="font-semibold">{item.new || 0}</span></p>
                    <p>MBU: <span className="font-semibold">{item.mbu || 0}</span></p>
                    <p>BIO: <span className="font-semibold">{item.bio || 0}</span></p>
                    <p>DEM: <span className="font-semibold">{item.dem || 0}</span></p>
                    <div className="border-t border-white/20 pt-1 mt-1">
                      Total: <span className="font-bold">{item.total || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-sm font-bold text-gray-700 mb-2">{item.total || 0}</div>
              <div
                className={`w-full max-w-24 rounded-t-2xl bg-gradient-to-t ${colors[index % colors.length]} shadow-md transition-all ${active ? "scale-105" : ""}`}
                style={{ height: `${height}px` }}
              />
              <p className="text-xs text-gray-500 mt-3 font-medium">{item.day}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TargetPieChart({ completed, target }) {
  const safeTarget = Math.max(Number(target || 500), 1);
  const safeCompleted = Math.min(Number(completed || 0), safeTarget);
  const remaining = Math.max(safeTarget - safeCompleted, 0);
  const percentage = Math.round((safeCompleted / safeTarget) * 100);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-pink-600" />
        Monthly Target Pie Chart
      </h3>

      <div className="flex flex-col items-center justify-center">
        <div
          className="w-52 h-52 rounded-full flex items-center justify-center shadow-inner"
          style={{
            background: `conic-gradient(#2563eb 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`,
          }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow">
            <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
            <span className="text-xs text-gray-500">Completed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-blue-700">{safeCompleted}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600 font-medium">Remaining</p>
            <p className="text-2xl font-bold text-gray-700">{remaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/my-analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = data?.summary || {};
  const weekly = data?.weekly_enrollment || [
    { day: "Mon", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
    { day: "Tue", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
    { day: "Wed", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
    { day: "Thu", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
    { day: "Fri", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
    { day: "Sat", new: 0, mbu: 0, bio: 0, dem: 0, total: 0 },
  ];
  const target = data?.monthly_target || { completed: 0, target: 500 };

  return (
    <div
      className="space-y-6 min-h-full p-6"
      style={{
        backgroundColor: "#eef7ff",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.12) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border text-gray-600">
          Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            <StatCard
              title="Wallet Load"
              value={formatCurrency(summary.wallet_load)}
              icon={Wallet}
              tone="blue"
            />
            <StatCard
              title="EOD Deduction"
              value={formatCurrency(summary.eod_deduction)}
              icon={ReceiptText}
              tone="red"
            />
            <StatCard
              title="Work Commission"
              value={formatCurrency(summary.work_commission)}
              icon={BadgeIndianRupee}
              tone="green"
            />
            <StatCard
              title="Avg Enrollment / Day"
              value={Math.round(Number(summary.avg_enrollment_per_day || 0))}
              icon={Activity}
              tone="purple"
            />
            <StatCard
              title="Monthly Target"
              value={`${target.completed || 0}/${target.target || 500}`}
              icon={Target}
              tone="pink"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <WeeklyEnrollmentChart data={weekly} />
            </div>
            <TargetPieChart completed={target.completed} target={target.target} />
          </div>
        </>
      )}
    </div>
  );
}
