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
  Download,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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


function InfoItem({ label, value }) {
  return (
    <div className="bg-sky-50/80 border border-sky-100 rounded-2xl px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-sky-600 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold mt-1 break-words">{value || "-"}</p>
    </div>
  );
}

function WeeklyEnrollmentChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const PLOT_HEIGHT = 260;
  const ticks = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Daily Enrollment Chart
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Total 15 ya kam ho to red candle, 16 ya zyada ho to green candle.
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-500 bg-gray-50 rounded-2xl">
          No enrollment data found
        </div>
      ) : (
        <div className="flex gap-3">
          {/* Fixed 0-100 Y-axis */}
          <div className="w-11 shrink-0 pt-2 pb-8">
            <div
              className="relative border-r border-slate-200 text-[11px] font-semibold text-slate-500"
              style={{ height: `${PLOT_HEIGHT}px` }}
            >
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute right-2 -translate-y-1/2 leading-none"
                  style={{ top: `${100 - tick}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
          </div>

          {/* Plot area: candle height is calculated on same 0-100 axis */}
          <div className="flex-1 overflow-x-auto pb-1">
            <div className="relative min-w-full pt-2 pb-8 border-b border-slate-300" style={{ height: `${PLOT_HEIGHT + 40}px` }}>
              {/* horizontal grid lines aligned with Y-axis ticks */}
              <div className="absolute left-0 right-0 top-2 pointer-events-none" style={{ height: `${PLOT_HEIGHT}px` }}>
                {ticks.map((tick) => (
                  <div
                    key={tick}
                    className="absolute left-0 right-0 border-t border-slate-100"
                    style={{ top: `${100 - tick}%` }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex items-end gap-3 h-full pr-2">
                {data.map((item, index) => {
                  const total = Number(item.total || 0);
                  const cappedTotal = Math.min(total, 100);
                  const height = Math.max(total > 0 ? 4 : 0, Math.round((cappedTotal / 100) * PLOT_HEIGHT));
                  const active = hovered?.date === item.date;
                  const candleColor = total <= 15 ? "bg-[#ef4444]" : "bg-[#18c653]";

                  return (
                    <div
                      key={`${item.date}-${index}`}
                      className="min-w-12 flex-1 flex flex-col items-center justify-end relative"
                      style={{ height: `${PLOT_HEIGHT + 32}px` }}
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {active && (
                        <div className="absolute bottom-full mb-2 z-20 w-36 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white p-2 shadow-xl text-[10px] leading-tight">
                          <p className="font-bold mb-1">{item.day} {item.date}</p>
                          <div className="space-y-0.5">
                            <p>New: <span className="font-semibold">{item.new}</span></p>
                            <p>MBU: <span className="font-semibold">{item.mbu}</span></p>
                            <p>BIO: <span className="font-semibold">{item.bio}</span></p>
                            <p>DEM: <span className="font-semibold">{item.dem}</span></p>
                            <div className="border-t border-white/20 pt-1 mt-1">
                              Total: <span className="font-bold">{item.total}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className="relative w-full flex justify-center"
                        style={{ height: `${PLOT_HEIGHT}px` }}
                      >
                        <div
                          className="absolute text-xs font-bold text-gray-700"
                          style={{ bottom: `${Math.min(height + 4, PLOT_HEIGHT - 4)}px` }}
                        >
                          {item.total}
                        </div>
                        <div
                          className={`absolute bottom-0 w-full max-w-16 ${candleColor} transition-all ${active ? "scale-x-105" : ""}`}
                          style={{ height: `${height}px` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-3 font-medium h-4">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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


function DailyReportsTable({ reports, onDownload }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Selected Date Reports</h3>
          <p className="text-sm text-gray-500 mt-1">
            Selected filter ke according UC aur ECMP report summary download.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-slate-500 text-sm bg-sky-50/60">
              <th className="px-4 py-3 rounded-l-xl">Report Date</th>
              <th className="px-4 py-3">Universal Client</th>
              <th className="px-4 py-3">ECMP Client</th>
              <th className="px-4 py-3 rounded-r-xl">Total</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  Selected date me koi report nahi mila
                </td>
              </tr>
            ) : (
              reports.map((row) => (
                <tr key={row.report_date} className="border-b last:border-0 hover:bg-sky-50/50">
                  <td className="px-4 py-4 font-semibold text-slate-800">{row.report_date}</td>
                  <td className="px-4 py-4">
                    {row.uc_available ? (
                      <button
                        type="button"
                        onClick={() => onDownload(row.uc_report_id)}
                        className="inline-flex items-center gap-2 bg-sky-100 hover:bg-sky-200 text-sky-800 px-3 py-2 rounded-xl text-sm font-semibold"
                      >
                        <Download size={15} /> Download ZIP
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {row.ecmp_available ? (
                      <button
                        type="button"
                        onClick={() => onDownload(row.ecmp_report_id)}
                        className="inline-flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-2 rounded-xl text-sm font-semibold"
                      >
                        <Download size={15} /> Download ZIP
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-bold text-blue-700">
                    {row.total_enrollment || 0} enrollment
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StaffAnalytics() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ category: "all", fromDate: "", toDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("range", "custom");
    params.set("category", appliedFilters.category);

    if (appliedFilters.fromDate) params.set("from_date", appliedFilters.fromDate);
    if (appliedFilters.toDate) params.set("to_date", appliedFilters.toDate);

    return params.toString();
  }, [appliedFilters]);

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


  const handleReportDownload = async (reportId) => {
    if (!reportId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/admin/reports/${reportId}/download-original`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${reportId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.response?.data?.detail || "Report download nahi ho raha hai");
    }
  };


  const applyDateFilter = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        alert("Please select valid From and To dates");
        return;
      }

      if (end < start) {
        alert("To date From date se pehle nahi ho sakta");
        return;
      }

      const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        alert("Maximum 30 days date range allowed");
        return;
      }
    }

    setAppliedFilters({ category, fromDate, toDate });
  };

  const summary = data?.summary || {};
  const staff = data?.staff || {};
  const weekly = data?.daily_chart || data?.weekly_enrollment || [];
  const dailyReports = data?.daily_reports || [];
  const rawTarget = data?.monthly_target || {};
  const target = {
    completed: Number(rawTarget.completed || 0),
    target: 500,
    percentage: Math.round((Number(rawTarget.completed || 0) / 500) * 100),
  };

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
      <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-sm border border-blue-100">
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-xl mb-5"
        >
          <ArrowLeft size={16} /> Back to Users
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-sky-100 bg-sky-50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
            {staff.avatar || staff.photo || staff.profile_photo ? (
              <img
                src={staff.avatar || staff.photo || staff.profile_photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Activity className="w-10 h-10 text-sky-600" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
            <p className="text-slate-500 mt-1">Complete staff activity overview</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5 text-sm">
              <InfoItem label="Name" value={staff.name} />
              <InfoItem label="Email ID" value={staff.email} />
              <InfoItem label="Aadhaar No" value={staff.aadhaar || staff.aadhaar_no} />
              <InfoItem label="Mobile No" value={staff.mobile || staff.mobile_no} />
              <InfoItem label="Staff ID" value={staff.staff_id} />
              <InfoItem label="Station ID" value={staff.station_id || staff.stationId} />
              <InfoItem label="Joining Date" value={staff.joining_date} />
              <InfoItem label="BRC / District" value={`${staff.brc || "-"} / ${staff.district || "-"}`} />
            </div>
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
              value={Math.round(Number(summary.avg_enrollment_per_day || 0))}
              subtitle="Selected period average"
              icon={Activity}
              tone="purple"
            />
            <StatCard
              title="Monthly Target"
              value={`${target.completed || 0}/500`}
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

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border px-4 py-2 rounded-xl bg-white"
                >
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border px-4 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border px-4 py-2 rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={applyDateFilter}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-xl font-bold shadow-sm"
              >
                GO
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <WeeklyEnrollmentChart data={weekly} />
            </div>
            <TargetPieChart completed={target.completed} target={target.target} />
          </div>

          <DailyReportsTable reports={dailyReports} onDownload={handleReportDownload} />
        </>
      )}
    </div>
  );
}
