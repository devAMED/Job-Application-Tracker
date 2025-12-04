import axios from "axios";

const API_BASE_URL = "http://localhost:5001";
const getAuthHeaders = () => {
  const token = localStorage.getItem("jat_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function applyToJob(jobId, notes = "") {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/applications/${jobId}`,
      { notes },
      { headers: getAuthHeaders() }
    );
    return response.data.application;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to apply to job";
    throw new Error(message);
  }
}

export async function getMyApplications() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/applications/my`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load applications";
    throw new Error(message);
  }
}

export async function getAllApplications() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/applications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load all applications";
    throw new Error(message);
  }
}

export async function updateApplicationStatus(id, status) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/applications/${id}/status`,
      { status },
      { headers: getAuthHeaders() }
    );
    return response.data.application;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update status";
    throw new Error(message);
  }
}
