import axios from "axios";


export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ENV === "development" ? "http://localhost:5000/api/v1" : "https://live/api/v1",
  withCredentials: true,   
});


// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept /auth/refresh itself
    if (originalRequest.url?.includes("/auth/refresh-access-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/auth/refresh-access-token");
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed → logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); 
  }
);

export default apiClient;
