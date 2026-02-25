import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true (제거됨)
});

// ✅ Axios 인터셉터 추가: 모든 요청 헤더에 토큰을 자동으로 포함
api.interceptors.request.use(
  (config) => {
    // 이미 Authorization이 있으면 덮어쓰지 않음 (예: signup 시 OTP 토큰)
    if (config.headers.Authorization) return config;
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);