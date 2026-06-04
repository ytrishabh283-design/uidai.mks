import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Wallet,
  ReceiptText,
  BadgeIndianRupee,
  Activity,
  Target,
  ArrowLeft,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const MONTHLY_TARGET = 500;

const RANGE_OPTIONS = [
  { label: "1 Week", value: "1week" },
  { label: "2 Week", value: "2week" },
  { label: "3 Week", value: "3week" },
  { label: "4 Week", value: "4week" },
  { label: "Custom", value: "custom" },
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "ECMP", value: "ECMP" },
  { label: "UC", value: "UC" },
];

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  const tones = {
    blue: { icon: "text-blue-600 bg-blue-50", value: "text-blue-700" },
    red: { icon: "text-red-600 bg-red-50", value: "text-red-700" },
    green: { icon: "text-green-600 bg-green-50", value: "text-green-700" },
    purple: { icon: "text-purple-600 bg-purple-50", value: "text-purple-700" },
    pink: { icon: "text-pink-600 bg-pink-50", value: "text-pink-700" },
  };

  const selectedTone = tones[tone] || tones.blue;

  return (
    <div className="rounded-3xl p-5 bg-white shadow-sm border border-blue-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-semibold">{title}</p>
          <h3 className={`text-3xl font-bold mt-2 ${selectedTone.value}`}>{value}</h3>
          {subtitle && <p className="text-slate-400 text-xs mt-2">{subtitle}</p>}
        </div>
        <div className={`${selectedTone.icon} p-3 rounded-2xl`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

function WeeklyEnrollmentChart({ data }) {
  const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
    const found = data.find((item) => (item.day || item.week) === day);
    return found || { day, week: day, new: 0, mbu: 0, bio: 0, dem: 0, total: 0 };
  });

  const maxTotal = Math.max(...chartData.map((item) => item.total || 0), 1);

  const colors = [
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-purple-500 to-violet-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-rose-700",
    "from-cyan-500 to-sky-700",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Working Day Enrollment Chart
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Mon-Sat candles. Cursor le jaane par New, MBU, BIO aur DEM detail dikhega.
          </p>
        </div>
      </div>

      <div className="relative h-80 flex items-end gap-5 px-2 pt-8 pb-8 border-b border-gray-200">
        {chartData.map((item, index) => {
          const height = Math.max(12, Math.round(((item.total || 0) / maxTotal) * 230));

          return (
            <div
              key={item.day || item.week}
              className="group flex-1 flex flex-col items-center justify-end relative"
            >
              <div className="pointer-events-none hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 w-60 rounded-2xl bg-slate-900 text-white p-4 shadow-xl text-sm">
                <p className="font-bold mb-2">{item.day || item.week}</p>
                <div className="space-y-1">
                  <p>New Aadhaar: <span className="font-semibold">{item.new || 0}</span></p>
                  <p>MBU Update: <span className="font-semibold">{item.mbu || 0}</span></p>
                  <p>Biometric Update: <span className="font-semibold">{item.bio || 0}</span></p>
                  <p>Demographic Update: <span className="font-semibold">{item.dem || 0}</span></p>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    Total: <span className="font-bold">{item.total || 0}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm font-bold text-gray-700 mb-2">{item.total || 0}</div>
              <div
                className={`w-full max-w-24 rounded-t-2xl bg-gradient-to-t ${colors[index % colors.length]} shadow-md transition-transform group-hover:scale-105`}
                style={{ height: `${height}px` }}
              />
              <p className="text-xs text-gray-500 mt-3 font-medium">{item.day || item.week}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TargetPieChart({ completed, target }) {
  const safeTarget = Math.max(Number(target || 0), 1);
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

export default function StaffAnalytics() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [range, setRange] = useState("1week");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("range", range);
    params.set("category", category);

    if (range === "custom") {
      if (fromDate) params.set("from_date", fromDate);
      if (toDate) params.set("to_date", toDate);
    }

    return params.toString();
  }, [range, category, fromDate, toDate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/users/${userId}/analytics?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Analytics load nahi ho raha hai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [queryString, userId]);

  const summary = data?.summary || {};
  const staff = data?.staff || {};
  const weekly = data?.weekly_enrollment || [];
  const backendTarget = data?.monthly_target || {};
  const targetCompleted = Number(backendTarget.completed || 0);
  const targetPercentage = Math.round((Math.min(targetCompleted, MONTHLY_TARGET) / MONTHLY_TARGET) * 100);
  const target = {
    completed: targetCompleted,
    target: MONTHLY_TARGET,
    percentage: targetPercentage,
  };

  return (
    <div
      className="space-y-6 min-h-screen -m-6 p-6"
      style={{
        backgroundColor: "#eef7ff",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.12) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/users")}
              className="inline-flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl mb-4"
            >
              <ArrowLeft size={16} /> Back to Users
            </button>
            <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
            <p className="text-slate-500 mt-2">
              {staff.name || "Staff"} • {staff.staff_id || "-"} • {staff.brc || "-"} [{staff.district || "-"}]
            </p>
          </div>
          <div className="hidden md:block bg-blue-50 text-blue-600 p-4 rounded-2xl">
            <Activity size={42} />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border text-gray-600">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            <StatCard
              title="Wallet Load"
              value={formatCurrency(summary.wallet_load)}
              subtitle="Selected period"
              icon={Wallet}
              tone="blue"
            />
            <StatCard
              title="EOD Deduction"
              value={formatCurrency(summary.eod_deduction)}
              subtitle="Paid report amount"
              icon={ReceiptText}
              tone="red"
            />
            <StatCard
              title="Work Commission"
              value={formatCurrency(summary.work_commission)}
              subtitle="₹10 / enrollment"
              icon={BadgeIndianRupee}
              tone="green"
            />
            <StatCard
              title="Avg Enrollment / Day"
              value={summary.avg_enrollment_per_day || 0}
              subtitle="Selected period average"
              icon={Activity}
              tone="purple"
            />
            <StatCard
              title="Monthly Target"
              value={`${target.completed || 0}/${MONTHLY_TARGET}`}
              subtitle={`${target.percentage || 0}% completed`}
              icon={Target}
              tone="pink"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">Date Filter</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {RANGE_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setRange(item.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    range === item.value
                      ? "bg-sky-300 text-sky-900 shadow"
                      : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setRange("custom");
                }}
                className="border px-4 py-2 rounded-xl"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setRange("custom");
                }}
                className="border px-4 py-2 rounded-xl"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border px-4 py-2 rounded-xl"
              >
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
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
