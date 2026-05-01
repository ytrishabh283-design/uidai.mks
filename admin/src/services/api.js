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
  const res = await API.post("/admin/login", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};
export const getReports = async () => {
  const res = await API.get("/reports");
  return res.data;
};
export const getUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await API.post("/admin/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/admin/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};
