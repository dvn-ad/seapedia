const BASE_URL = "http://localhost:8080/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const activeRole = typeof window !== "undefined" ? localStorage.getItem("active_role") : null;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (activeRole) {
    headers.set("X-Active-Role", activeRole);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
