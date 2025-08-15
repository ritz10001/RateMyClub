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
import ClubForm from "@/app/components/Forms/ClubForm"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"

export default function CreateClubPage({ params }) {
  const { schoolId } = useParams();
  console.log("this is school id", schoolId);
  const { user } = useAuth();
  const router = useRouter();
  const [universities, setUniversities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [clubData, setClubData] = useState({
    name: "",
    description: "",
    clubLocation: "",
    universityId: null,
    categoryId: null,
    tagIds: []
  });
  const auth = getAuth(app);
  useEffect(() => {
    fetch(`http://localhost:5095/api/University/all-colleges`)
      .then(res => res.json())
      .then(data => {
        console.log("UNIS", data);
        setUniversities(data);
      })
  }, []);
  useEffect(() => {
    fetch('http://localhost:5095/api/Categories')
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setCategories(data);
        });
    }, []);
  useEffect(() => {
    fetch('http://localhost:5095/api/Tag')
      .then(res => res.json())
      .then(data => {
      console.log(data);
      setTags(data);
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      console.log("CLUB DATA");
      console.log(clubData);
      console.log("this is college id", schoolId);
      const response = await fetch("http://localhost:5095/api/AdminClub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(clubData)
      })
      if(response.ok){
        toast.success("Club successfully created!", {
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
            <h1 className="text-4xl font-bold text-gray-900">Create Club</h1>
          </div>
        </div>
        <ClubForm
          clubData={clubData}
          setClubData={setClubData}
          handleSubmit={handleSubmit}
          submitLabel="Create Club"
          universities={universities}
          tags={tags}
          categories={categories}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </div>
  )
}
