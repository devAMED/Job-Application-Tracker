import { apiClient } from "./apiClient";

export const registerUser = async ({ name, email, password, role }) => {
  try {
    const res = await apiClient.post("/api/auth/register", {
      name,
      email,
      password,
      role,
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const res = await apiClient.post("/api/auth/login", { email, password });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
};
