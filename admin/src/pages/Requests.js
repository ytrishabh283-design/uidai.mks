import React, { useEffect, useState } from "react";
import { getAllRequests } from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      console.log("Error loading requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-2xl font-bold mb-5">EOD Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">User ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t">
                <td className="p-3">{req.user_id}</td>
                <td className="p-3">{req.date}</td>
                <td className="p-3">{req.reason || "-"}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded">
                    Approve
                  </button>

                  <button className="bg-red-600 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
