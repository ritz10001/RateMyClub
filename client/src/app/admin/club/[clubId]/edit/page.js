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
// 

export default function EditClubPage({ params }) {
  const { clubId } = useParams();
  console.log(clubId);
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [clubData, setClubData] = useState(null);
  const [tagNamesFromClub, setTagNamesFromClub] = useState([]);


  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`http://localhost:5095/api/Club/${clubId}`, {
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch club.");
        const data = await res.json();
        setClubData(data);
        console.log("DATA", data);
        setSelectedTags(data.tagIds || []);
        setClubData({
          name: data.name,
          description: data.description,
          clubLocation: data.clubLocation,
          categoryId: data.categoryId,
          tagIds: [],         // Temporarily empty
        });
        setTagNamesFromClub(data.tags);
      } 
      catch (err) {
        toast.error("Could not load club data.");
      }
    };
    const fetchMeta = async () => {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('http://localhost:5095/api/Categories'),
        fetch('http://localhost:5095/api/Tag')
      ]);
      setCategories(await categoriesRes.json());
      setTags(await tagsRes.json());
    };

    fetchClub();
    fetchMeta();
  }, [clubId, user]);

  useEffect(() => {
    if (tags.length > 0 && tagNamesFromClub.length > 0) {
      const matchedTagIds = tags
        .filter(tag => tagNamesFromClub.includes(tag.name))
        .map(tag => tag.id);

      setSelectedTags(matchedTagIds);
      setClubData(prev => ({ ...prev, tagIds: matchedTagIds }));
    }
  }, [tags, tagNamesFromClub]);


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5095/api/AdminClub/${clubId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify(clubData)
      })
      if(response.ok){
        toast.success("Club successfully updated!", {
          duration: 5000, // 5 seconds
        });
        router.push("/all-schools");
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.message || "Update failed.");
      }
    }
    catch(error){
      toast.error("Network error. Please check your connection.");
    }
  }

  if(!clubData){
   return(
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="font-bold text-xl">Now Loading..</p>
      </div>
    </div>
    )
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
            <h1 className="text-4xl font-bold text-gray-900">Edit Club</h1>
          </div>
        </div>
        <ClubForm
          clubData={clubData}
          setClubData={setClubData}
          handleSubmit={handleSubmit}
          submitLabel="Edit Club"
          tags={tags}
          categories={categories}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isEditMode={true}
        />
      </div>
    </div>
  )
}
