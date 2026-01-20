import { apiClient } from "./apiClient";

// 1) Simple apply (JSON body) - keep it if some UI still uses it
export async function applyToJob(jobId, notes = "") {
  try {
    const res = await apiClient.post(`/api/applications/${jobId}`, { notes });
    return res.data.application || res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to apply to job";
    throw new Error(message);
  }
}

// 2) Apply with full form + CV upload (multipart/form-data)
export async function applyToJobWithForm(jobId, formData) {
  try {
    const res = await apiClient.post(`/api/applications/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.application || res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to apply to job";
    throw new Error(message);
  }
}

// 3) User: my applications list
export async function getMyApplications() {
  try {
    const res = await apiClient.get(`/api/applications/my`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load applications";
    throw new Error(message);
  }
}

// 4) User: summary map (jobId + status) for “Applied/Under review”
export async function getMyApplicationsSummary() {
  try {
    const res = await apiClient.get(`/api/applications/my/summary`);
    return res.data; // [{ jobId, status }, ...]
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to load applications summary";
    throw new Error(message);
  }
}

// 5) Admin: all applications
export async function getAllApplications() {
  try {
    const res = await apiClient.get(`/api/applications`);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to load all applications";
    throw new Error(message);
  }
}

// 6) Admin: update status
export async function updateApplicationStatus(id, status) {
  try {
    const res = await apiClient.put(`/api/applications/${id}/status`, { status });
    return res.data.application || res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update status";
    throw new Error(message);
  }
}
