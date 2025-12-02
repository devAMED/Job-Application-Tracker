import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const registerUser = async ({ name, email, password, role }) => {
  // role is optional, backend defaults to "user" if not provided
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
    role,
  });
  // backend returns: { message, token, user }
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  // backend returns: { message, token, user }
  return response.data;
};
