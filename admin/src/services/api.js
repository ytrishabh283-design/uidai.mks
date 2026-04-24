import axios from "axios";

const API = axios.create({
  baseURL: "https://staff-system-51i3.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = async (data) => {
  const res = await API.post("/auth/login", {
    staff_id: data.staff_id,
    password: data.password,
  });

  return res.data;
};

export const getReports = async () => {
  const res = await API.get("/reports");
  return res.data;
};
