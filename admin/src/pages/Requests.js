import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Download, Eye, X, CheckCircle, XCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const emptyForm = {
  new_enrollment_count: "",
  mandatory_bio_count: "",
  demographic_update_count: "",
  biometric_update_count: "",
  amount: "",
  remark: "",
};

function statusClass(status) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const totalEnrollment = useMemo(() => {
    return (
      Number(form.new_enrollment_count || 0) +
      Number(form.mandatory_bio_count || 0) +
      Number(form.demographic_update_count || 0) +
      Number(form.biometric_update_count || 0)
    );
  }, [form]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
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
    // eslint-disable-next-line
  }, []);

  const openView = async (requestId) => {
    try {
      setDetailsLoading(true);
      setError("");
      setMessage("");
      setForm(emptyForm);
      const res = await axios.get(`${API}/admin/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Request detail load nahi ho raha");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeView = () => {
    setSelected(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const downloadFile = async (requestId) => {
    try {
      const response = await axios.get(`${API}/admin/requests/${requestId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="?([^";]+)"?/);
      const filename = match?.[1] || `eod-request-${requestId}.zip`;

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
    if (!selected) return;

    if (Number(form.amount || 0) < 0) {
      setError("Amount negative nahi ho sakta");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const payload = {
        new_enrollment_count: Number(form.new_enrollment_count || 0),
        mandatory_bio_count: Number(form.mandatory_bio_count || 0),
        demographic_update_count: Number(form.demographic_update_count || 0),
        biometric_update_count: Number(form.biometric_update_count || 0),
        amount: Number(form.amount || 0),
        remark: form.remark || "",
      };

      await axios.post(`${API}/admin/requests/${selected.id}/approve`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Request approved, wallet debit aur EOD report update ho gaya ✅");
      await fetchRequests();
      await openView(selected.id);
    } catch (err) {
      setError(err?.response?.data?.detail || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectRequest = async () => {
    if (!selected) return;

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API}/admin/requests/${selected.id}/reject`,
        { remark: form.remark || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Request rejected ✅");
      await fetchRequests();
      await openView(selected.id);
    } catch (err) {
      setError(err?.response?.data?.detail || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5">
      <h2 className="text-2xl font-bold mb-5">EOD Requests</h2>

      {error && !selected && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 mb-4">{error}</div>
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
                <th className="p-3">Type</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="p-3">{req.staff_id || req.user_id}</td>
                  <td className="p-3 font-medium">{req.staff_name || "-"}</td>
                  <td className="p-3">{req.date}</td>
                  <td className="p-3 font-semibold text-blue-700">{req.report_type || "-"}</td>
                  <td className="p-3">{req.reason || "-"}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded text-sm ${statusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => openView(req.id)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      <Eye size={15} /> View
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-5 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="text-2xl font-bold">EOD Request View</h3>
                <p className="text-gray-500 text-sm">Approve karne par wallet debit aur paid report update hoga.</p>
              </div>
              <button onClick={closeView} className="p-2 rounded-full hover:bg-gray-100">
                <X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {detailsLoading ? (
                <p>Loading details...</p>
              ) : (
                <>
                  {message && (
                    <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-3 flex gap-2 items-center">
                      <CheckCircle size={18} /> {message}
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 flex gap-2 items-center">
                      <XCircle size={18} /> {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Info label="Staff Name" value={selected.staff_name || selected.user?.name} />
                    <Info label="Staff ID" value={selected.staff_id || selected.user?.staff_id} />
                    <Info label="Report Date" value={selected.date} />
                    <Info label="Report Type" value={selected.report_type} />
                    <Info label="Status" value={selected.status} />
                    <Info label="Approved Amount" value={selected.approved_amount ? `₹${selected.approved_amount}` : "-"} />
                  </div>

                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                    <p className="text-sm font-semibold text-sky-700 mb-2">Reason</p>
                    <p className="text-gray-800">{selected.reason || "-"}</p>
                  </div>

                  <button
                    onClick={() => downloadFile(selected.id)}
                    disabled={!selected.has_file}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    <Download size={18} /> Download Original ZIP
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <NumberInput label="No. of New Enrollment" name="new_enrollment_count" value={form.new_enrollment_count} onChange={handleChange} />
                    <NumberInput label="No. of MBU" name="mandatory_bio_count" value={form.mandatory_bio_count} onChange={handleChange} />
                    <NumberInput label="No. of Demo" name="demographic_update_count" value={form.demographic_update_count} onChange={handleChange} />
                    <NumberInput label="No. of Bio" name="biometric_update_count" value={form.biometric_update_count} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <p className="text-sm font-semibold text-blue-700">Total Enrollment</p>
                      <p className="text-3xl font-bold text-blue-800 mt-2">{totalEnrollment}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Amount ₹</label>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        min="0"
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Remark / Comment</label>
                      <input
                        type="text"
                        name="remark"
                        value={form.remark}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Manual verification completed"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={approveRequest}
                      disabled={actionLoading || selected.status === "approved"}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={rejectRequest}
                      disabled={actionLoading || selected.status === "approved"}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border">
      <p className="text-xs uppercase text-gray-500 font-bold">{label}</p>
      <p className="text-gray-900 font-semibold mt-1 break-words">{value || "-"}</p>
    </div>
  );
}

function NumberInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min="0"
        className="w-full border rounded-xl px-4 py-3"
        placeholder="0"
      />
    </div>
  );
}
