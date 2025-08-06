


// "use client";
// import axios from "axios";
// import { toast } from "sonner";


// // This will hold the current JWT. It's a simple, module-level variable.
// let currentToken = null; 

// // This callback function is how we will tell the AuthContext to update its state.
// let onUpdateUserCallback = () => {};

// // Function to set the token. AuthContext will call this.
// export const setAuthToken = (token) => {
//     currentToken = token;
// };

// // Function for the AuthContext to register its callback.
// export const setUpdateUserCallback = (callback) => {
//     onUpdateUserCallback = callback;
// };

// export const api = axios.create({
//   baseURL: "http://localhost:5095/api",
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// api.interceptors.request.use((config) => {
//     // This is the CRUCIAL part. It uses the `currentToken` variable,
//     // which is updated by the AuthContext, not a stale closure.
//     if (currentToken) {
//         config.headers.Authorization = `Bearer ${currentToken}`;
//     }
//     // Add logs to verify what's being sent
//     console.log("➡️ Request Interceptor - Authorization Header:", config.headers.Authorization);
//     console.log("🚀 Making request to:", config.url, "at", new Date().toISOString());
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// api.interceptors.response.use(
//   (response) => {
//     console.log("⬇️ Received response:", response.config.url);
//     return response;
//   },
//   async (error) => {
//     console.log("❌ Request failed:", error.config?.url, error.response?.status);
//     console.log("🔍 Request headers:", error.config?.headers);
//     console.log("🔍 Was logged in ref should be available here");
//     const originalRequest = error.config;

//     // Handle refresh endpoint failures
//     if (originalRequest.url.includes('/Account/refresh')) {
//       console.log("🔄 Refresh endpoint failed");
//       // Always call updateUserState(null) for refresh failures
//       // Let AuthContext decide whether to show modal based on context
//       console.log("🛑 Refresh failed - calling updateUserState(null)");
//       updateUserState(null);
//       return Promise.reject(error);
//     }

//     // Skip refresh for login/logout endpoints
//     const skipEndpoints = [
//       '/Account/login',
//       '/Account/logout'
//     ];
    
//     if (skipEndpoints.some(path => originalRequest.url.includes(path))) {
//       console.log("⏭️ Skipping refresh for", originalRequest.url);
//       return Promise.reject(error);
//     }

//     // Handle 401 errors for other endpoints
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log("🔑 Attempting token refresh");
//       originalRequest._retry = true;

//       try {
//         const { data } = await api.post('/Account/refresh');
//         console.log("🔄 Refresh successful");
//         updateUserState(data);
//         return api(originalReqauest);
//       } 
//       catch (refreshError) {
//         console.log("🛑 Refresh failed - session expired");
//         console.log("🛑 About to call updateUserState(null)");
//         updateUserState(null);
//         console.log("🛑 Called updateUserState(null)");
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
