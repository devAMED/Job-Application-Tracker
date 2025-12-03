import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jat_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getJobs() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/jobs`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch jobs";
    throw new Error(message);
  }
}

export async function createJob(jobData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/jobs`, jobData, {
      headers: getAuthHeaders()
    });
    return response.data.job;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create job";
    throw new Error(message);
  }
}

export async function updateJob(id, jobData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/jobs/${id}`, jobData, {
      headers: getAuthHeaders()
    });
    return response.data.job;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update job";
    throw new Error(message);
  }
}

export async function deleteJob(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/jobs/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data?.message || "Job deleted successfully";
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete job";
    throw new Error(message);
  }
}
