import axios from "axios";

const API = axios.create({
      // baseURL: "http://127.0.0.1:8000/api",
      baseURL: "http://10.10.7.76:8000/api",
      // baseURL: "http://103.186.20.115:14000/api",
      headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
});

// Handle 401 globally
API.interceptors.response.use(
      (response) => response,
      (error) => {
            if (error.response?.status === 401) {
                  localStorage.removeItem("user");
                  localStorage.removeItem("access_token");
                  window.location.href = "/login";
            }
            return Promise.reject(error);
      }
);

export default API;
