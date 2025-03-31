import axios from "axios";
import Cookies from "js-cookie";

const axiosAdmin = axios.create({
  baseURL: "https://localhost:7229/api/",
});

axiosAdmin.interceptors.request.use((config) => {
  let token = Cookies.get("ADMIN_ACCESS_TOKEN");

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosAdmin.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response.status == 401 || response.status == 403) {
      Cookies.remove("ADMIN_ACCESS_TOKEN");
    }
  }
);

export default axiosAdmin;
