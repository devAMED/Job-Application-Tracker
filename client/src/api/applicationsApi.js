import { apiClient } from "./apiClient";

/**
 * USER: apply to job with FormData (multipart)
 */
export async function applyToJobWithForm(jobId, formData) {
  const res = await apiClient.post(`/api/applications/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.application;
}

/**
 * USER: update tracking fields on own application
 * patch can include: { reminderAt, extraNotes }
 */
export async function updateApplicationTracking(appId, patch) {
  const res = await apiClient.put(`/api/applications/${appId}/tracking`, patch);
  return res.data.application;
}

/**
 * USER: my applications list
 */
export async function getMyApplications() {
  const res = await apiClient.get("/api/applications/my");
  return res.data;
}

/**
 * USER: summary used to disable Apply button
 */
export async function getMyApplicationsSummary() {
  const res = await apiClient.get("/api/applications/my/summary");
  return res.data; // [{ jobId, status }]
}

/**
 * USER: analytics (response rate)
 */
export async function getMyApplicationsAnalytics() {
  const res = await apiClient.get("/api/applications/my/analytics");
  return res.data;
}

/**
 * USER: get one of my applications (details page)
 */
export async function getMyApplicationById(appId) {
  const res = await apiClient.get(`/api/applications/my/${appId}`);
  return res.data.application;
}

/**
 * ADMIN: list all apps
 */
export async function getAllApplications() {
  const res = await apiClient.get("/api/applications");
  return res.data;
}

/**
 * ADMIN: get one app (details)
 */
export async function getApplicationByIdAdmin(appId) {
  const res = await apiClient.get(`/api/applications/${appId}`);
  return res.data.application;
}

/**
 * ADMIN: update status
 */
export async function updateApplicationStatus(appId, status) {
  const res = await apiClient.put(`/api/applications/${appId}/status`, { status });
  return res.data.application;
}

/**
 * ADMIN: schedule/update interview
 */
export async function updateInterviewAdmin(appId, payload) {
  const res = await apiClient.put(`/api/applications/${appId}/interview`, payload);
  return res.data.application;
}

/**
 * USER: add note to own application
 */
export async function addNoteToApplication(appId, text) {
  const res = await apiClient.post(`/api/applications/${appId}/notes`, { text });
  return res.data.application;
}

/**
 * ADMIN: add admin note
 */
export async function addAdminNoteToApplication(appId, text) {
  const res = await apiClient.post(`/api/applications/${appId}/admin/notes`, { text });
  return res.data.application;
}

/**
 * USER: set reminder datetime
 */
export async function setReminder(appId, reminderAt) {
  const res = await apiClient.put(`/api/applications/${appId}/reminder`, { reminderAt });
  return res.data.application;
}

/**
 * ADMIN: fetch CV as blob (works with auth headers)
 */
export async function getApplicationCvAdmin(appId) {
  const res = await apiClient.get(`/api/applications/${appId}/cv`, {
    responseType: "blob",
  });
  return res.data; // Blob
}

/**
 * USER: update my application (multipart so we can optionally upload a new CV)
 */
export async function updateMyApplicationWithForm(appId, formData) {
  const res = await apiClient.put(`/api/applications/my/${appId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.application;
}
