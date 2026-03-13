import axios from "axios";

const axiosInstance = axios.create({
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
    },
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

export default axiosInstance;
