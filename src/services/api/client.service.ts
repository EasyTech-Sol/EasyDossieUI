import axios from "axios";


const client = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Interceptor para redirecionar em caso de erro 403
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