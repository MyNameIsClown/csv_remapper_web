const API_BASE_URL = import.meta.env.API_URL || "http://localhost:8000/api/v1";

export async function fetchHandler(endpoint:string, options:RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const defaultHeaders: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  const config = {
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data?.message || response.statusText);
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
