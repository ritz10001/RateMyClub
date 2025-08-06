"use client";
import { useAuth } from "@/app/context/AuthContext";

export default function TestModalButton() {
  const { setShowExpiredModal, showExpiredModal } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={() => setShowExpiredModal(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Test Modal (Current: {showExpiredModal ? 'Open' : 'Closed'})
      </button>
    </div>
  );
}