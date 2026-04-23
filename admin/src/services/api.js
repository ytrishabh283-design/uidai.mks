import axios from "axios";
import { deleteUser, getUsers } from "../services/api";
const handleDelete = async (id) => {
  try {
    await deleteUser(id);
    setUsers(users.filter((u) => u.id !== id));
  } catch (err) {
    alert("Delete failed");
  }
};
<button
  onClick={() => handleDelete(user.id)}
  className="bg-red-500 text-white px-3 py-1 rounded"
>
  Delete
</button>
// USERS CRUD

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
  await API.delete(`/admin/users/${id}`);
};
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
