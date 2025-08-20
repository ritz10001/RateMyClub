"use client"

import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from 'sonner';
import { useParams, useRouter } from "next/navigation"
import UniversityForm from "@/app/components/Forms/UniversityForm"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"

export default function EditUniversityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [universityData, setUniversityData] = useState({
    name: "",
    location: "",
    officialWebsite: "",
    description: "",
    logoUrl: ""
  });
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5095/api/AdminUniversity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          name: universityData.name,
          location: universityData.location,
          logoUrl: universityData.logoUrl,
          description: universityData.description,
          officialWebsite: universityData.officialWebsite
        })
      })
      if(response.ok){
        toast.success("University Created!", {
          duration: 5000, // 5 seconds
        });
        router.replace("/all-schools");
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.message || "Creation failed. Please try again.");
      }
    }
    catch(error){
      toast.error("Network error. Please check your connection.");
      console.error("Submission failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/all-schools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Create University</h1>
          </div>
        </div>
        <UniversityForm
          universityData={universityData}
          setUniversityData={setUniversityData}
          handleSubmit={handleSubmit}
          submitLabel="Update University"
        />
      </div>
    </div>
  )
}
