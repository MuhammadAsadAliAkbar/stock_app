import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({ baseURL: API, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((c) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("token");
    if (t) c.headers.Authorization = `Bearer ${t}`;
  }
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(e);
  }
);

export default api;
export const login = (d: any) => api.post("/auth/login", d);
export const register = (d: any) => api.post("/auth/register", d);
export const getMe = () => api.get("/auth/me");
export const getStocks = (params?: any) => api.get("/stocks", { params });
export const getStock = (id: string) => api.get(`/stocks/${id}`);
export const getMarketSummary = () => api.get("/stocks/summary/market");
export const placeOrder = (d: any) => api.post("/orders", d);
export const getMyOrders = () => api.get("/orders/my");
export const getPortfolio = () => api.get("/portfolio");
export const getTrades = () => api.get("/portfolio/trades");
export const marketTick = () => api.post("/market/tick", {});
export const getAnalytics = () => api.get("/market/analytics");
