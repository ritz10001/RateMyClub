"use client"

import { useState, useEffect } from "react"

export function useProfileCompletion() {
  const [showProfileToast, setShowProfileToast] = useState(false)

  const triggerProfileCompletion = () => {
    setShowProfileToast(true)
  }

  const dismissProfileToast = () => {
    setShowProfileToast(false)
    // Store in localStorage so we don't show it again for this session
    localStorage.setItem("profileToastDismissed", "true")
  }

  // Check if we should show the toast on mount
  useEffect(() => {
    const wasDismissed = localStorage.getItem("profileToastDismissed")
    if (wasDismissed) {
      setShowProfileToast(false)
    }
  }, [])

  return {
    showProfileToast,
    triggerProfileCompletion,
    dismissProfileToast,
  }
}
