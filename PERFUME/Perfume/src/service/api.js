import axios from "axios";

const api = axios.create({
  // വെർസലിലെ എൻവയോൺമെന്റ് വേരിയബിൾ എടുക്കും, ഇല്ലെങ്കിൽ ലോക്കൽഹോസ്റ്റ് എടുക്കും
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/",
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