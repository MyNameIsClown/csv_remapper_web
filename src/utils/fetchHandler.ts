
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
  let isError404 = true
  try {
    const response = await fetch(url, config);
    isError404 = false
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (!response.ok) {
      throw new Error(data?.detail["Error"] || response.statusText);
    }

    return data;
  } catch (error) {
    if (!isError404){
      throw error
    }else{
      // Case 404
      throw Error("El servidor no responde porfavor intentelo de nuevo mas tarde", {cause: "Servidor inoperativo o fuera de alcance"});
    }
  }
}
