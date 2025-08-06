// // /utils/sessionTimeout.js

// "use client";

// import { useState, useEffect } from 'react';

// // Helper to get the stored user
// const getStoredUser = () => {
//   if (typeof window === 'undefined') return null;
//   const userStr = localStorage.getItem("user");
//   return userStr ? JSON.parse(userStr) : null;
// };

// export const useSessionTimeout = (onTimeout, user) => {
//   useEffect(() => {
//     let timerId;

//     if (!user || !user.refreshTokenExpiry) {
//       console.log("useSessionTimeout: No user or refreshTokenExpiry, skipping");
//       return;
//     }

//     const expiryTime = new Date(user.refreshTokenExpiry).getTime();
//     const now = Date.now();
//     const timeout = expiryTime - now;

//     console.log("useSessionTimeout: Expiry check", {
//       expiryTime,
//       now,
//       timeout,
//       expiryDate: new Date(user.refreshTokenExpiry),
//     });

//     if (timeout > 0) {
//       console.log(`useSessionTimeout: Setting timeout for ${timeout}ms`);
//       timerId = setTimeout(() => {
//         console.log("useSessionTimeout: Refresh token expired, calling timeout handler");
//         onTimeout();
//       }, timeout);
//     } else if (expiryTime <= now) {
//       console.log("useSessionTimeout: Refresh token already expired, calling timeout handler");
//       onTimeout();
//     }

//     // Cleanup function: this will run when the component unmounts
//     // OR when the 'user' dependency changes (e.g., on logout).
//     return () => {
//       if (timerId) {
//         console.log("useSessionTimeout: Cleaning up timer");
//         clearTimeout(timerId);
//       }
//     };
//   }, [user, onTimeout]);
// };