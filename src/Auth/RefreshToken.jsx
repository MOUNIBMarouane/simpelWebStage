// import axios from "axios";

// const BASE_URL = "http://localhost:5204/api";

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loop
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     if (error.response && error.response.status === 403) {
//       originalRequest._retry = true;
//       try {
//         const response = await axios.post(
//           `${BASE_URL}/token/refresh/`,
//           {},
//           { withCredentials: true }
//         );

//         if (response.status === 200) {
//           return api.request(originalRequest);
//         }
//       } catch (refreshError) {
//         try {
//           await api.post("/logout/", {}, { withCredentials: true });
//         } catch (logoutError) {
//           console.error("Error during logout:", logoutError);
//         }

//         window.location.href = "/";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
