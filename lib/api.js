import axios from "axios";

const api = axios.create({
  baseURL: "https://api-yayandev.vercel.app/api",
});

export default api;
