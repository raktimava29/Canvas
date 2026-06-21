import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(
            localStorage.getItem("userInfo")
        );

        if(userInfo?.token){
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("userInfo");
            
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
)

export default api;