import axios from "axios";

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export default backendApi;
