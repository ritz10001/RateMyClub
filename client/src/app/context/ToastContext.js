"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [showProfileToast, setShowProfileToast] = useState(false)

  return <ToastContext.Provider value={{ showProfileToast, setShowProfileToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
