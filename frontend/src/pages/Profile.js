import { useState, useEffect } from "react";

const API_BASE =
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_URL ||
  "https://uidai-mks-gov-in.onrender.com";

export default function Profile({ user }) {
  const [profile, setProfile] = useState({
    avatar: "",
    name: "",
    email: "",
    mobile: "",
    stationId: "",
    operatorId: "",
    aadhaar: "",
    district: "",
    brc: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getInitialProfile = () => ({
    avatar: "",
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    stationId: user?.station_id || user?.stationId || "",
    operatorId: user?.operator_id || user?.operatorId || user?.staff_id || "",
    aadhaar: user?.aadhaar || "",
    district: user?.district || "",
    brc: user?.brc || "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("profileData");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setProfile({
          ...getInitialProfile(),
          ...parsed,
          operatorId:
            parsed.operatorId ||
            parsed.opratorId ||
            parsed.opratorid ||
            user?.operator_id ||
            user?.staff_id ||
            "",
        });
      } catch {
        setProfile(getInitialProfile());
      }
    } else {
      setProfile(getInitialProfile());
    }
  }, [user]);

  const saveProfile = async (data) => {
    setProfile(data);
    localStorage.setItem("profileData", JSON.stringify(data));
    window.dispatchEvent(new Event("profileUpdated"));

    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      name: data.name || "",
      email: data.email || "",
      mobile: data.mobile || "",
      station_id: data.stationId || "",
      operator_id: data.operatorId || "",
      aadhaar: data.aadhaar || "",
      district: data.district || "",
      brc: data.brc || "",
    };

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Profile database me save nahi hua");
      }

      setMessage("Profile saved successfully ✅");
    } catch (err) {
      setError("Local profile save ho gaya, lekin database me save nahi hua.");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updated = { ...profile, avatar: reader.result };
      saveProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    const updated = {
      ...profile,
      name: prompt("Name:", profile.name) || profile.name,
      email: prompt("Email:", profile.email) || profile.email,
      mobile: prompt("Mobile:", profile.mobile) || profile.mobile,
      stationId: prompt("Station ID:", profile.stationId) || profile.stationId,
      operatorId: prompt("Operator ID:", profile.operatorId) || profile.operatorId,
      aadhaar: prompt("Aadhaar:", profile.aadhaar) || profile.aadhaar,
      district: prompt("District:", profile.district) || profile.district,
      brc: prompt("BRC:", profile.brc) || profile.brc,
    };

    saveProfile(updated);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-blue-600 text-white text-center p-6">
        <img
          src={profile.avatar || "https://via.placeholder.com/120"}
          alt="avatar"
          className="w-28 h-28 rounded-full mx-auto border-4 border-white object-cover"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="mt-3 text-sm"
        />

        <h2 className="text-xl font-bold mt-3">{profile.name}</h2>
        <p className="text-sm">{profile.email}</p>
      </div>

      <div className="p-6 space-y-3 text-sm">
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl">
            {error}
          </div>
        )}

        <Detail label="Mobile" value={profile.mobile} />
        <Detail label="Station ID" value={profile.stationId} />
        <Detail label="Operator ID" value={profile.operatorId} />
        <Detail label="Aadhaar" value={profile.aadhaar} />
        <Detail label="District" value={profile.district} />
        <Detail label="BRC" value={profile.brc} />
      </div>

      <div className="p-4">
        <button
          onClick={handleEdit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );
}
