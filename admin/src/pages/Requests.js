import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/admin/requests`, {
        headers: authHeaders(),
      });
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Requests load nahi ho rahe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openRequest = async (requestId) => {
    try {
      setDetailLoading(true);
      setMessage("");
      setError("");
      const res = await axios.get(`${API}/admin/requests/${requestId}`, {
        headers: authHeaders(),
      });
      setSelectedRequest(res.data);
      setAmount(res.data?.approved_amount || "");
    } catch (err) {
      setError(err?.response?.data?.detail || "Request detail load nahi ho raha");
    } finally {
      setDetailLoading(false);
    }
  };

  const downloadFile = async (requestId) => {
    try {
      const response = await axios.get(`${API}/admin/requests/${requestId}/download`, {
        headers: authHeaders(),
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="(.+)"/);
      const filename = match ? match[1] : `request-${requestId}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.response?.data?.detail || "File download nahi ho raha");
    }
  };

  const approveRequest = async () => {
    if (!selectedRequest?.id) return;

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      setError("Please enter valid amount");
      return;
    }

    try {
      setError("");
      setMessage("");
      await axios.post(
        `${API}/admin/requests/${selectedRequest.id}/approve`,
        { amount: numericAmount },
        { headers: authHeaders() }
      );
      setMessage("Request approved successfully ✅");
      await fetchRequests();
      await openRequest(selectedRequest.id);
    } catch (err) {
      setError(err?.response?.data?.detail || "Approve failed");
    }
  };

  const rejectRequest = async () => {
    if (!selectedRequest?.id) return;
    if (!window.confirm("Kya aap is request ko reject karna chahte ho?")) return;

    try {
      setError("");
      setMessage("");
      await axios.post(
        `${API}/admin/requests/${selectedRequest.id}/reject`,
        {},
        { headers: authHeaders() }
      );
      setMessage("Request rejected successfully ✅");
      await fetchRequests();
      await openRequest(selectedRequest.id);
    } catch (err) {
      setError(err?.response?.data?.detail || "Reject failed");
    }
  };

  const statusBadge = (status) => {
    const classes =
      status === "approved"
        ? "bg-green-100 text-green-700"
        : status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classes}`}>
        {status || "pending"}
      </span>
    );
  };

  if (selectedRequest) {
    const user = selectedRequest.user || {};

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <button
            onClick={() => {
              setSelectedRequest(null);
              setMessage("");
              setError("");
            }}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl mb-5"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h2 className="text-2xl font-bold mb-2">EOD Request View</h2>
          <p className="text-gray-500">Review file, enter amount, approve or reject.</p>

          {message && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-xl">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-5">
            {detailLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Request Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <Info label="Staff Name" value={user.name || selectedRequest.staff_name} />
                  <Info label="Staff ID" value={user.staff_id || selectedRequest.staff_id} />
                  <Info label="User ID" value={selectedRequest.user_id} />
                  <Info label="Date" value={selectedRequest.date} />
                  <Info label="BRC / District" value={`${user.brc || selectedRequest.brc || "-"} / ${user.district || selectedRequest.district || "-"}`} />
                  <Info label="Status" value={selectedRequest.status} />
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Reason</p>
                  <div className="bg-gray-50 border rounded-xl p-4 text-gray-800">
                    {selectedRequest.reason || "-"}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => downloadFile(selectedRequest.id)}
                    disabled={!selectedRequest.has_file}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    <Download size={18} />
                    Download Report
                  </button>
                  {!selectedRequest.has_file && (
                    <p className="text-sm text-gray-500 mt-2">No file attached</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="text-xl font-bold mb-4">Action</h3>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Current Status</p>
              {statusBadge(selectedRequest.status)}
            </div>

            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Enter Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            />

            <button
              onClick={approveRequest}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold mb-3"
            >
              <CheckCircle size={18} /> Approve
            </button>

            <button
              onClick={rejectRequest}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold"
            >
              <XCircle size={18} /> Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-2xl font-bold mb-5">EOD Requests</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Staff ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="p-3">{req.staff_id || req.user_id}</td>
                  <td className="p-3">{req.staff_name || "-"}</td>
                  <td className="p-3">{req.date}</td>
                  <td className="p-3">{req.reason || "-"}</td>
                  <td className="p-3">{statusBadge(req.status)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openRequest(req.id)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">{label}</p>
      <p className="font-semibold text-gray-900 mt-1 break-words">{value || "-"}</p>
    </div>
  );
}
