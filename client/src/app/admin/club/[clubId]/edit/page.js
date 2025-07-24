"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from 'sonner';
import { useParams, useRouter } from "next/navigation"
import UniversityForm from "@/app/components/Forms/UniversityForm"

export default function EditUniversityPage({ params }) {
  const { schoolId } = useParams();
  console.log("this is school id", schoolId);
  const { user } = useAuth();
  const router = useRouter();
  const [universityData, setUniversityData] = useState({
    name: "",
    location: "",
    officialWebsite: "",
    description: "",
    logoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try{
        const response = await fetch(`http://localhost:5095/api/University/${schoolId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          }
        });
        if(response.ok){
            const data = await response.json();
            console.log(data);
            setUniversityData(data);
        }
      }
      catch(error){
        toast.error("Failed to fetch university", error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchUniversityData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("UNIVERSITY DATA");
      console.log(universityData);
      console.log("this is college id", schoolId);
      const response = await fetch(`http://localhost:5095/api/AdminUniversity/${schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
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
        toast.success("University update completed!", {
          duration: 5000, // 5 seconds
        });
        router.push("/all-schools");
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.message || "Update failed. Please try again.");
      }
    }
    catch(error){
      toast.error("Network error. Please check your connection.");
      console.error("Update Submission failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link
             href="/all-schools"
             className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
            >
          <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Update University</h1>
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
