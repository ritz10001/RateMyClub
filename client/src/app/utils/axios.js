"use client";

import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://localhost:5095/api",
});

let showSessionExpiredModal = () => {};
export const setSessionExpiredModalCallback = (callback) => {
  showSessionExpiredModal = callback;
};

// Callback to update the user state in AuthContext
let updateUserState = () => {};
export const setUpdateUserCallback = (callback) => {
  updateUserState = callback;
};

// Helper to get the stored user
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// This variable will hold a promise for the refresh token call.
// This prevents multiple requests from trying to refresh at the same time.
let isRefreshing = false;
let refreshPromise = null;

// Add the token to every request, but only if it exists
api.interceptors.request.use(async (config) => {
  const user = getStoredUser();

  if (user?.token) {
    // Decode the JWT to get the expiry time (exp claim)
    const decodedToken = JSON.parse(atob(user.token.split('.')[1]));
    const tokenExpiry = decodedToken.exp * 1000; // Convert to milliseconds

    // Check if the access token is about to expire or already expired
    const isAccessTokenExpired = tokenExpiry < Date.now();

    // Check if the refresh token is still valid
    const isRefreshTokenExpired = new Date(user.refreshTokenExpiry) <= new Date();

    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      console.log("Access token expired. Refreshing token proactively.");

      // If a refresh is already in progress, wait for it to finish
      if (!refreshPromise) {
        // Start the refresh process and store the promise
        refreshPromise = (async () => {
          try {
            console.log("Attempting token refresh...");
            const refreshResponse = await axios.post(
              `http://localhost:5095/api/Account/refresh`,
              {
                userId: user.userId,
                token: user.token,
                refreshToken: user.refreshToken,
                ...(user.firstName && { firstName: user.firstName }),
                ...(user.lastName && { lastName: user.lastName }),
                ...(user.email && { email: user.email }),
                ...(user.roles && { roles: user.roles }),
              },
              { headers: { 'Content-Type': 'application/json' } }
            );
            
            const newUserData = refreshResponse.data;
            updateUserState(newUserData);
            refreshPromise = null; // Reset the promise after completion
            return newUserData.token;

          } catch (refreshError) {
            console.log("Refresh failed, logging out user");
            updateUserState(null);
            toast.error("Session expired. Please log in again.");
            refreshPromise = null; // Reset promise on failure
            return Promise.reject(refreshError);
          }
        })();
      }

      const newToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newToken}`;

    } else if (isRefreshTokenExpired) {
      console.log("Refresh token expired, logging out");
      updateUserState(null);
      showSessionExpiredModal();
      return Promise.reject(new Error("Session expired"));
    } else {
      // Token is still valid, attach it to the header
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// The response interceptor is now much simpler, just for handling true 401s
// that might occur for other reasons (e.g., token revoked, user disabled)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // We already handle expired tokens proactively in the request interceptor.
    // This part of the code is now just for other authentication errors.
    if (error.response?.status === 401) {
        console.log("Received a 401 response, but not from an expired token.");
        updateUserState(null);
        toast.error("You are not authorized. Please log in.");
    }
    return Promise.reject(error);
  }
);