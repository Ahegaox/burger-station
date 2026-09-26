const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(data), data?.detail);
  }
  return data;
}

function getErrorMessage(data) {
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) return "Revisa los datos del formulario";
  return "Ha ocurrido un error inesperado";
}

export const api = {
  register: (data) => apiRequest("/auth/register", { method: "POST", body: data }),
  login: (data) => apiRequest("/auth/login", { method: "POST", body: data }),
  me: (token) => apiRequest("/auth/me", { token }),
  getMenu: () => apiRequest("/menu"),
  createOrder: (order, token) => apiRequest("/orders", { method: "POST", body: order, token }),
  getOrder: (orderId, token) => apiRequest(`/orders/${orderId}`, { token }),
};