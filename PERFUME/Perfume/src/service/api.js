import axios from "axios";
const api = axios.create({
  // ലോക്കൽ ലിങ്ക് മാറ്റി എൻവയോൺമെന്റ് വേരിയബിൾ ഉപയോഗിക്കുക
  baseURL: import.meta.env.VITE_API_URL || "https://perfumeshop-api-noorullah-cydkgsazbdeuf5f2.southindia-01.azurewebsites.net/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;