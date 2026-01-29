import { apiClient } from "./apiClient";

// get all jobs (public)
export async function getJobs(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.sort) params.set("sort", filters.sort);
    if (filters.locationType && filters.locationType !== "all") {
      params.set("locationType", filters.locationType);
    }
    if (filters.jobType && filters.jobType !== "all") {
      params.set("jobType", filters.jobType);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await apiClient.get(`/api/jobs${query}`);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch jobs";
    throw new Error(message);
  }
}

// job details, fetching a single job
export async function getJobById(id) {
  try {
    const res = await apiClient.get(`/api/jobs/${id}`);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to load job details";
    throw new Error(message);
  }
}

// admin create job
export async function createJob(jobData) {
  try {
    const res = await apiClient.post("/api/jobs", jobData);
    return res.data.job || res.data; // support either response shape
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create job";
    throw new Error(message);
  }
}

// admin update job
export async function updateJob(id, jobData) {
  try {
    const res = await apiClient.put(`/api/jobs/${id}`, jobData);
    return res.data.job || res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update job";
    throw new Error(message);
  }
}

// admin delete job
export async function deleteJob(id) {
  try {
    const res = await apiClient.delete(`/api/jobs/${id}`);
    return res.data?.message || "Job deleted successfully";
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete job";
    throw new Error(message);
  }
}
