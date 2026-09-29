import axios from "axios";


const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",

});


api.interceptors.request.use(

    (config)=>{

        const token =
        localStorage.getItem("token");

        if(token){

            config.headers.Authorization =
            `Bearer ${token}`;

        }

        return config;

    },

    (error)=>{

        return Promise.reject(error);

    }

);


// If a request comes back 401, the token is missing/expired/invalid —
// clear it and send the user back to login instead of leaving them on
// a broken page with silent failed requests.
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

        }

        return Promise.reject(error);

    }

);


export default api;
