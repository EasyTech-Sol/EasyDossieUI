import axios from "axios";

let BASE_URL = ''

if (import.meta.env.DEV)
  BASE_URL = 'http://localhost:3000';
else
  BASE_URL = import.meta.env.VITE_API_BASE_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export default client