import axios from "axios";

const API = axios.create({
    baseURL: "https://anant-couture-backend.onrender.com/api/"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("access");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

API.interceptors.response.use(
    response => response,
    async error => {
        if (!error.response) {
            // Server is waking up — retry after 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            return API.request(error.config);
        }
        return Promise.reject(error);
    }
);

export default API;