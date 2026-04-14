import axios from "axios";

const api = axios.create({
  baseURL: " http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// ─── Trades ───────────────────────────────────────────────────────────────────

export const tradesApi = {
  getAll: (params = {}) => api.get("/api/trades", { params }),
  getById: (id) => api.get(`/api/trades/${id}`),
  create: (data) => api.post("/api/trades", data),
  update: (id, data) => api.put(`/api/trades/${id}`, data),
  delete: (id) => api.delete(`/api/trades/${id}`),
};

// ─── Account ──────────────────────────────────────────────────────────────────

export const accountApi = {
  get: () => api.get("/api/account"),
  setup: (start_balance) => api.post("/api/account/setup", { start_balance }),
  balanceHistory: () => api.get("/api/account/balance-history"),
  reset: () => api.post("/api/account/reset"),
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsApi = {
  summary: () => api.get("/api/analytics/summary"),
  calendar: (year, month) => api.get("/api/analytics/calendar", { params: { year, month } }),
  emotions: () => api.get("/api/analytics/emotions"),
  monthly: () => api.get("/api/analytics/monthly"),
  pairs: () => api.get("/api/analytics/pairs"),
};

export default api;