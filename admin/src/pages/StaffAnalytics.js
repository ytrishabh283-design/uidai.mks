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

function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className={`rounded-3xl p-5 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-white/80 text-xs mt-2">{subtitle}</p>}
        </div>
        <div className="bg-white/20 p-3 rounded-2xl">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

function WeeklyEnrollmentChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const maxTotal = Math.max(...data.map((item) => item.total || 0), 1);

  const colors = [
    "from-blue-500 to-blue-700",
    "from-green-500 to-emerald-700",
    "from-purple-500 to-violet-700",
    "from-orange-500 to-rose-600",
    "from-pink-500 to-red-600",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Weekly Enrollment Chart
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Candle par cursor le jaane par New, MBU, BIO aur DEM detail dikhega.
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-500 bg-gray-50 rounded-2xl">
          No enrollment data found
        </div>
      ) : (
        <div className="relative h-80 flex items-end gap-5 px-2 pt-8 pb-8 border-b border-gray-200">
          {data.map((item, index) => {
            const height = Math.max(12, Math.round(((item.total || 0) / maxTotal) * 230));
            const active = hovered?.week === item.week;

            return (
              <div
                key={item.week}
                className="flex-1 flex flex-col items-center justify-end relative"
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
              >
                {active && (
                  <div className="absolute bottom-full mb-3 z-20 w-56 rounded-2xl bg-gray-900 text-white p-4 shadow-xl text-sm">
                    <p className="font-bold mb-2">{item.week}</p>
                    <div className="space-y-1">
                      <p>New Aadhaar: <span className="font-semibold">{item.new}</span></p>
                      <p>MBU Update: <span className="font-semibold">{item.mbu}</span></p>
                      <p>Biometric Update: <span className="font-semibold">{item.bio}</span></p>
                      <p>Demographic Update: <span className="font-semibold">{item.dem}</span></p>
                      <div className="border-t border-white/20 pt-2 mt-2">
                        Total: <span className="font-bold">{item.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm font-bold text-gray-700 mb-2">{item.total}</div>
                <div
                  className={`w-full max-w-24 rounded-t-2xl bg-gradient-to-t ${colors[index % colors.length]} shadow-md transition-all ${active ? "scale-105" : ""}`}
                  style={{ height: `${height}px` }}
                />
                <p className="text-xs text-gray-500 mt-3 font-medium">{item.week}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TargetPieChart({ completed, target }) {
  const safeTarget = Math.max(Number(target || 0), 1);
  const safeCompleted = Math.min(Number(completed || 0), safeTarget);
  const remaining = Math.max(safeTarget - safeCompleted, 0);
  const percentage = Math.round((safeCompleted / safeTarget) * 100);

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, userId]);

  const summary = data?.summary || {};
  const staff = data?.staff || {};
  const weekly = data?.weekly_enrollment || [];
  const target = data?.monthly_target || { completed: 0, target: 1000 };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/users")}
              className="inline-flex items-center gap-2 text-sm bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl mb-4"
            >
              <ArrowLeft size={16} /> Back to Users
            </button>
            <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
            <p className="text-blue-100 mt-2">
              {staff.name || "Staff"} • {staff.staff_id || "-"} • {staff.brc || "-"} [{staff.district || "-"}]
            </p>
          </div>
          <div className="hidden md:block bg-white/15 p-4 rounded-2xl">
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
              gradient="from-blue-500 to-blue-700"
            />
            <StatCard
              title="EOD Deduction"
              value={formatCurrency(summary.eod_deduction)}
              subtitle="Paid report amount"
              icon={ReceiptText}
              gradient="from-red-500 to-orange-600"
            />
            <StatCard
              title="Work Commission"
              value={formatCurrency(summary.work_commission)}
              subtitle="Wallet load - EOD deduction"
              icon={BadgeIndianRupee}
              gradient="from-green-500 to-emerald-700"
            />
            <StatCard
              title="Avg Enrollment / Day"
              value={summary.avg_enrollment_per_day || 0}
              subtitle="Selected period average"
              icon={Activity}
              gradient="from-purple-500 to-violet-700"
            />
            <StatCard
              title="Monthly Target"
              value={`${target.completed || 0}/${target.target || 1000}`}
              subtitle={`${target.percentage || 0}% completed`}
              icon={Target}
              gradient="from-pink-500 to-rose-700"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border p-5">
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
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
