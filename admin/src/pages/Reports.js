import React, { useEffect, useState } from "react";
import { getReports } from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([
    { id: 1, name: "Daily Collection Report", date: "23-04-2026", status: "Completed" },
    { id: 2, name: "Staff Performance Report", date: "22-04-2026", status: "Pending" },
    { id: 3, name: "Transaction Summary", date: "21-04-2026", status: "Completed" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const data = await getReports();
        if (Array.isArray(data) && data.length > 0) {
          setReports(data);
        }
      } catch (error) {
        console.log("Reports API not connected yet");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium">
          Generate Report
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : (
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
      )}
    </div>
  );
}
