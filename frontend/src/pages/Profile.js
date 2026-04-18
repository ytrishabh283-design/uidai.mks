// ===== PROFILE DATA =====
let profileData = JSON.parse(localStorage.getItem("profileData")) || {
  avatar: "https://via.placeholder.com/110",
  name: "Your Name",
  email: "example@gmail.com",
  mobile: "",
  stationId: "",
  aadhaar: "",
  district: "",
  brc: ""
};

// ===== LOAD PROFILE =====
function loadProfile() {
  document.getElementById("avatar").src = profileData.avatar;
  document.getElementById("name").innerText = profileData.name;
  document.getElementById("email").innerText = profileData.email;
  document.getElementById("mobile").innerText = profileData.mobile;
  document.getElementById("stationId").innerText = profileData.stationId;
  document.getElementById("aadhaar").innerText = profileData.aadhaar;
  document.getElementById("district").innerText = profileData.district;
  document.getElementById("brc").innerText = profileData.brc;
}

// ===== SAVE DATA =====
function saveProfile() {
  localStorage.setItem("profileData", JSON.stringify(profileData));
}

// ===== PHOTO UPLOAD =====
function uploadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    profileData.avatar = e.target.result;
    document.getElementById("avatar").src = profileData.avatar;
    saveProfile();
  };
  reader.readAsDataURL(file);
}

// ===== EDIT PROFILE =====
function editProfile() {
  let name = prompt("Enter Name:", profileData.name);
  let email = prompt("Enter Email:", profileData.email);
  let mobile = prompt("Enter Mobile:", profileData.mobile);
  let stationId = prompt("Enter Station ID:", profileData.stationId);
  let aadhaar = prompt("Enter Aadhaar:", profileData.aadhaar);
  let district = prompt("Enter District:", profileData.district);
  let brc = prompt("Enter BRC:", profileData.brc);

  if (name !== null) profileData.name = name;
  if (email !== null) profileData.email = email;
  if (mobile !== null) profileData.mobile = mobile;
  if (stationId !== null) profileData.stationId = stationId;
  if (aadhaar !== null) profileData.aadhaar = aadhaar;
  if (district !== null) profileData.district = district;
  if (brc !== null) profileData.brc = brc;

  saveProfile();
  loadProfile();
}

// ===== AUTO LOAD =====
window.onload = loadProfile;
