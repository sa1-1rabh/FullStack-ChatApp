import axios from "axios";

//CREATING AND INSTANCE OF AXIOS TO BE USED
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE == "development"
      ? "http://localhost:8000/api"
      : "/api",
  withCredentials: true,
});
