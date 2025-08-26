import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "/api",
  withCredentials: true
});

api.defaults.xsrfCookieName = "csrftoken";
api.defaults.xsrfHeaderName = "X-CSRFToken";

export async function ensureCsrf() {
  try { await api.get("/auth/csrf"); } catch {}
}