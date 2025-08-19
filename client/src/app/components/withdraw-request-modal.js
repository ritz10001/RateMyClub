"use client"

import { UserRound, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function WithdrawRequestModal({isOpen, onClose, onDelete}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden" // Prevent background scrolling
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-grey-500/50 backdrop-blur-sm dark:bg-black/70" onClick={onClose} />

        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 dark:hover:bg-zinc-700"
            aria-label="Close modal"
            >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Modal Header */}
            <div className="text-center pt-8 pb-6 px-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-red-900">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Withdraw Request</h2>
            <p className="text-gray-600 text-lg dark:text-gray-300">
                Are you sure you want to withdraw this request?
            </p>
            </div>
            <div className="px-6 pb-6">
            <div className="flex justify-center space-x-3">
                <Button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={onDelete}>
                Yes
                </Button>
                <Button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={onClose}>
                No
                </Button>
            </div>
            </div>
        </div>
        </div>
    )   
}