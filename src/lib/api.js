// Central place for all backend calls.
// Change VITE_API_URL in .env when you deploy the backend somewhere real.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://merge-heavy-promote-alternate.trycloudflare.com/api";

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // ---- Vehicles (public) ----
  getVehicles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/vehicles?${query}`).then(handleResponse);
  },
  getVehicleBySlug: (slug) =>
    fetch(`${API_URL}/vehicles/${slug}`).then(handleResponse),

  // ---- Vehicles (admin) ----
  createVehicle: (data) =>
    fetch(`${API_URL}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateVehicle: (id, data) =>
    fetch(`${API_URL}/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteVehicle: (id) =>
    fetch(`${API_URL}/vehicles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse),

  uploadVehicleImages: (id, files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    return fetch(`${API_URL}/vehicles/${id}/images`, {
      method: "POST",
      headers: authHeaders(), // do NOT set Content-Type - browser sets multipart boundary
      body: formData,
    }).then(handleResponse);
  },

  // ---- Categories ----
  getCategories: () => fetch(`${API_URL}/categories`).then(handleResponse),

  // ---- Articles (public) ----
  getArticles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/articles?${query}`).then(handleResponse);
  },
  getArticleBySlug: (slug) =>
    fetch(`${API_URL}/articles/${slug}`).then(handleResponse),

  // ---- Articles (admin) ----
  getAllArticlesAdmin: () =>
    fetch(`${API_URL}/articles/admin/all`, { headers: authHeaders() }).then(
      handleResponse,
    ),
  createArticle: (data) =>
    fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateArticle: (id, data) =>
    fetch(`${API_URL}/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteArticle: (id) =>
    fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse),
  uploadArticleCoverImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetch(`${API_URL}/articles/${id}/cover-image`, {
      method: "POST",
      headers: authHeaders(), // do NOT set Content-Type - browser sets multipart boundary
      body: formData,
    }).then(handleResponse);
  },

  // ---- Testimonials ----
  getTestimonials: () => fetch(`${API_URL}/testimonials`).then(handleResponse),
  createTestimonial: (data) =>
    fetch(`${API_URL}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteTestimonial: (id) =>
    fetch(`${API_URL}/testimonials/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse),

  // ---- Auth ----
  login: (email, password) =>
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  // ---- Enquiries (public forms) ----
  submitConsultation: (data) =>
    fetch(`${API_URL}/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  submitFindCarRequest: (data) =>
    fetch(`${API_URL}/find-car-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  submitTradeInRequest: (data) =>
    fetch(`${API_URL}/trade-in-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // ---- Enquiries (admin reads) ----
  getConsultations: () =>
    fetch(`${API_URL}/consultations`, { headers: authHeaders() }).then(
      handleResponse,
    ),
  getFindCarRequests: () =>
    fetch(`${API_URL}/find-car-requests`, { headers: authHeaders() }).then(
      handleResponse,
    ),
  getTradeInRequests: () =>
    fetch(`${API_URL}/trade-in-requests`, { headers: authHeaders() }).then(
      handleResponse,
    ),
};

export const IMAGE_BASE_URL = API_URL.replace("/api", "");
