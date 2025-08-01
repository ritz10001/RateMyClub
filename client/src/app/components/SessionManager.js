// /components/session-manager.js

"use client";

import { useState, useEffect } from 'react';
import { useSessionTimeout } from '../utils/sessionTimeout';
import { setSessionExpiredModalCallback, setUpdateUserCallback } from '../utils/axios';
import SessionExpiredModal from './session-expiry-modal';
import { useAuth } from '@/app/context/AuthContext'; // Assuming you have an AuthContext

export default function SessionManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout from your AuthContext

  const showModal = () => {
    console.log("SessionManager: Opening modal");
    setIsModalOpen(true);
  };

  const handleLogoutAndClose = () => {
    console.log("SessionManager: Handling logout and closing modal");
    setIsModalOpen(false);
    logout("exp"); // Use the global logout function
  };

  // Pass user to the timeout hook so it reacts to changes
  useSessionTimeout(showModal, user);

  useEffect(() => {
    console.log("SessionManager: Setting API modal and user update callbacks");
    setSessionExpiredModalCallback(showModal);
    // This is important: the axios interceptor needs to know how to update the user state.
    setUpdateUserCallback((newUserData) => {
      // Assuming your AuthContext has a function to update the user
      if (newUserData) {
        localStorage.setItem("user", JSON.stringify(newUserData));
        // You would also need a way to set the user state here, e.g., via a setAuthUser function
      } else {
        localStorage.removeItem("user");
        // And a way to set the state to null
      }
    });
    
    // Cleanup the callbacks when the component unmounts
    return () => {
      setSessionExpiredModalCallback(() => {});
      setUpdateUserCallback(() => {});
    };
  }, []);

  console.log("SessionManager: Rendering");
  return <SessionExpiredModal isOpen={isModalOpen} onClose={handleLogoutAndClose} />;
}