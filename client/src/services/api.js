const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredBaseUrl) {
    // Ensure /api/v1 is appended if not already present
    if (configuredBaseUrl.endsWith('/api/v1')) {
      return configuredBaseUrl;
    }
    if (configuredBaseUrl.endsWith('/')) {
      return `${configuredBaseUrl}api/v1`;
    }
    return `${configuredBaseUrl}/api/v1`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;
  }

  return "http://localhost:5000/api/v1";
};

const API_BASE_URL = resolveApiBaseUrl();

const logRequest = (url, options) => {
  console.log("[api:request]", {
    method: options.method || "GET",
    url,
    headers: options.headers || {},
    body: options.body || null,
  });
};

const logResponse = (url, response, payload) => {
  console.log("[api:response]", {
    url,
    status: response.status,
    ok: response.ok,
    payload,
  });
};

const logNetworkError = (url, error) => {
  console.error("[api:network-error]", {
    url,
    message: error.message,
  });
};

const request = async (path, options = {}) => {
  let response;
  const url = `${API_BASE_URL}${path}`;
  const { headers, ...restOptions } = options;
  const fetchOptions = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  };

  logRequest(url, fetchOptions);

  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    logNetworkError(url, error);
    throw new Error(`Unable to connect to the API at ${API_BASE_URL}. Check that the backend server is running and CORS is configured correctly.`);
  }

  const data = await response.json().catch(() => ({}));
  logResponse(url, response, data);

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data.data;
};

const registerRequest = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

const loginRequest = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

const saveStudentProfileRequest = (token, payload) =>
  request("/student/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

const getStudentProfileRequest = (token) =>
  request("/student/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getQuestionsRequest = (token) =>
  request("/questions", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const submitScoresRequest = (token, payload) =>
  request("/submit-scores", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

const analyzeScoresRequest = (token, payload = {}) =>
  request("/analyze", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

const getRecommendationsRequest = (token) =>
  request("/recommendations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const downloadReportRequest = async (token) => {
  let response;
  const url = `${API_BASE_URL}/download-report`;
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  logRequest(url, fetchOptions);

  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    logNetworkError(url, error);
    throw new Error(`Unable to connect to the API at ${API_BASE_URL}. Check that the backend server is running and CORS is configured correctly.`);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    logResponse(url, response, data);
    throw new Error(data.message || "Failed to download report.");
  }

  logResponse(url, response, { type: "blob" });

  return response.blob();
};

export {
  analyzeScoresRequest,
  downloadReportRequest,
  getQuestionsRequest,
  getRecommendationsRequest,
  getStudentProfileRequest,
  loginRequest,
  registerRequest,
  saveStudentProfileRequest,
  submitScoresRequest,
};
