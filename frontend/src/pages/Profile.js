import { useState, useEffect } from "react";

export default function Profile({ user }) {
  const [profile, setProfile] = useState({
    avatar: "",
    name: "",
    email: "",
    mobile: "",
    stationId: "",
    aadhaar: "",
    district: "",
    brc: ""
  });

  // ===== Load Data =====
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profileData"));

    if (saved) {
      setProfile(saved);
    } else {
      setProfile({
        avatar: "",
        name: user?.name || "",
        email: user?.email || "",
        mobile: "",
        stationId: user?.staff_id || "",
        aadhaar: "",
        district: "",
        brc: ""
      });
    }
  }, [user]);

  // ===== Save Data =====
  const saveProfile = (data) => {
    setProfile(data);
    localStorage.setItem("profileData", JSON.stringify(data));
  };

  // ===== Upload Photo =====
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

  // ===== Edit Profile =====
  const handleEdit = () => {
    const updated = {
      ...profile,
      name: prompt("Name:", profile.name) || profile.name,
      email: prompt("Email:", profile.email) || profile.email,
      mobile: prompt("Mobile:", profile.mobile) || profile.mobile,
      stationId: prompt("Station ID:", profile.stationId) || profile.stationId,
      aadhaar: prompt("Aadhaar:", profile.aadhaar) || profile.aadhaar,
      district: prompt("District:", profile.district) || profile.district,
      brc: prompt("BRC:", profile.brc) || profile.brc
    };

    saveProfile(updated);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      
      {/* Top Section */}
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

      {/* Details */}
      <div className="p-6 space-y-3 text-sm">
        <Detail label="Mobile" value={profile.mobile} />
        <Detail label="Station ID" value={profile.stationId} />
        <Detail label="Aadhaar" value={profile.aadhaar} />
        <Detail label="District" value={profile.district} />
        <Detail label="BRC" value={profile.brc} />
      </div>

      {/* Button */}
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

// Reusable Row Component
function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );
}
