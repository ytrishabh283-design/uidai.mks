import axios from "axios";

const API = axios.create({
  baseURL: "https://staff-system-51i3.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginAdmin(payload) {
  try {
    const response = await API.post("/admin/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Unable to login. Check backend connection."
    );
  }
}

export async function getUsers() {
  try {
    const response = await API.get("/admin/users");
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch users");
  }
}

export async function getReports() {
  try {
    const response = await API.get("/admin/reports");
    return response.data;
  } catch (error) {
    throw new Error("Unable to fetch reports");
  }
}
