"use client"

import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from 'sonner';
import { useParams, useRouter } from "next/navigation"
import ClubForm from "@/app/components/Forms/ClubForm"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"

export default function EditClubPage({ params }) {
  const { clubId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [clubData, setClubData] = useState(null);
  const [tagNamesFromClub, setTagNamesFromClub] = useState([]);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const currentUser = auth.currentUser;
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`http://localhost:5095/api/Club/${clubId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          }
        });
        if(response.ok){
          const data = await response.json();
          setClubData(data);
          setSelectedTags(data.tagIds || []);
          setClubData({
            name: data.name,
            description: data.description,
            clubLocation: data.clubLocation,
            categoryId: data.categoryId,
            tagIds: []     
          });
          setTagNamesFromClub(data.tags);
        }
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
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5095/api/AdminClub/${clubId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
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
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
    )
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Edit Club</h1>
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
