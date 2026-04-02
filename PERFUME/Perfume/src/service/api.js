import axios from "axios";

// ഈ വരി കൂടി ചേർക്കുക (Product service-ന് വേണ്ടി)
export const URL = import.meta.env.VITE_API_URL || "https://perfumeshop-api-noorullah-cydkgsazbdeuf5f2.southindia-01.azurewebsites.net/api";

const api = axios.create({
  baseURL: URL,
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