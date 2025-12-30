const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function register(payload) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export default {
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMyReservations: () => request('/api/reservations/my'),
  createReservation: (payload) => request('/api/reservations', { method: 'POST', body: JSON.stringify(payload) }),
  cancelReservation: (id) => request(`/api/reservations/${id}`, { method: 'DELETE' }),

  // admin
  getAllReservations: (date) => request(`/api/admin/reservations${date ? '?date='+encodeURIComponent(date) : ''}`),
  updateReservation: (id, payload) => request(`/api/admin/reservations/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getTables: () => request('/api/admin/tables'),
  createTable: (payload) => request('/api/admin/tables', { method: 'POST', body: JSON.stringify(payload) }),
  updateTable: (id, payload) => request(`/api/admin/tables/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTable: (id) => request(`/api/admin/tables/${id}`, { method: 'DELETE' })
};

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getAdminReservations() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/admin/reservations', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load reservations');
  return res.json();
}
