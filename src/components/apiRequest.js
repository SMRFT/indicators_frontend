import axios from "axios";
/**
 * Reusable API request helper with token authentication
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object|null} data - Request body data for POST/PUT/PATCH/DELETE
 * @param {Object} headers - Additional headers to merge with defaults
 * @param {Object} config - Additional axios configuration (like params)
 * @returns {Promise<Object>} - Returns { success: boolean, data?: any, error?: string, status?: number }
 */
const extractBackendError = (data, status) => {
  if (!data) return `Error (${status})`;
  if (typeof data === "string") return data;
  if (data.error) return typeof data.error === "string" ? data.error : JSON.stringify(data.error);
  if (data.message) return typeof data.message === "string" ? data.message : JSON.stringify(data.message);
  if (typeof data === "object") {
    const entries = Object.entries(data);
    if (entries.length > 0) {
      const [key, val] = entries[0];
      const valStr = Array.isArray(val) ? val.join(", ") : (typeof val === "object" ? JSON.stringify(val) : String(val));
      return `${key}: ${valStr}`;
    }
  }
  return `Error (${status})`;
};

const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
  try {
    const token = localStorage.getItem("access_token");

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: token, // Use 'Bearer' if backend expects it
    };

    const config = {
      method,
      url,
      headers: { ...defaultHeaders, ...headers },
      validateStatus: () => true, // Don't throw errors for any status code
    };

    if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      config.data = data;
    }

    const response = await axios(config);

    // Success status codes (2xx range)
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }
    // Client errors (4xx range)
    else if (response.status >= 400 && response.status < 500) {
      const backendError = extractBackendError(response.data, response.status);
      return {
        success: false,
        error: backendError,
        status: response.status,
        data: response.data,
      };
    }
    // Server errors (5xx range)
    else if (response.status >= 500) {
      const backendError = extractBackendError(response.data, response.status);
      return {
        success: false,
        error: backendError || "Server error occurred.",
        status: response.status,
        data: response.data,
      };
    }
    // Other unexpected status codes
    else {
      return {
        success: false,
        error: "Unexpected response from server.",
        status: response.status,
        data: response.data,
      };
    }
  } catch (error) {
    console.error("Network or unexpected error:", error);
    return {
      success: false,
      error: error?.message || "Network error or unexpected issue occurred.",
      networkError: true,
    };
  }
};

export default apiRequest;