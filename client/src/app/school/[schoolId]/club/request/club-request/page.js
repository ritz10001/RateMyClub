"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Info, University } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from 'sonner';
import { useParams, useRouter } from "next/navigation"
import { api } from "@/app/utils/axios"
import { getAuth } from "firebase/auth"
import { app } from "@/app/utils/firebase"
import AuthRoute from "@/app/components/AuthRoute"

export default function RequestClubPage({ params }){
  const { schoolId } = useParams();
  const redirectPath = `/school/${schoolId}`;
  return(
    <AuthRoute redirectTo={redirectPath}>
      <RequestClubContent schoolId={schoolId} />
    </AuthRoute>
  );
}

function RequestClubContent({ schoolId }) {
  const router = useRouter();
  const { user } = useAuth();  
  console.log("USER INFO");
  console.log(user);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTag, setIsLoadingTag] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState(null);
  const auth = getAuth(app);
  const [clubData, setClubData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    requestedBy: user?.email || "",
    name: "",
    description: "",
    categoryId: null,
    universityId: schoolId,
    tagIds: []
  })

  const handleInputChange = (field, value) => {
    setClubData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        const response = await fetch("http://localhost:5095/api/Categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("FETCHING CATEGORIES");
        if(response.ok){
          const data = await response.json();
          console.log(data);
          setCategories(data);
          setIsLoading(false);
        }
      }
      catch(error){
        console.error("fetching categories failed");
      }
    }
    fetchCategories();
}, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/Tag", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if(response.ok){
          const data = await response.json();
          setTags(data);
          setIsLoadingTag(false);
        }
      }
      catch(error){
        console.error("fetching tags failed");
      }
    }
    fetchTags();
  }, []);

  const handleTagClick = (tagId) => {
    console.log("SELECTED TAG", tagId);
    console.log(selectedTags);
    if(selectedTags.includes(tagId)){
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    }
    else{
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tagId]);
      } 
      else {
        toast.error("You can select up to 3 tags only.");
      }
    }
  }

  const isFormValid = () => {
    const { name, description, categoryId } = clubData;

    return name.trim().length > 3 && 
            description.trim().length >= 20 &&
            categoryId;
    };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("TRYING NOW");
      console.log(clubData);
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();

      const response = await fetch("http://localhost:5095/api/ClubRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          fullName: clubData.fullName,
          name: clubData.name,
          description: clubData.description,
          categoryId: clubData.categoryId,
          universityId: schoolId,
          tagIds: selectedTags
        })
      });

      if(response.ok){
        const requestResponse = await response.json();
        console.log(requestResponse);
        toast.success("Club request submitted! We'll review it shortly.", {
          duration: 5000,
        });
        router.replace(`/school/${schoolId}`);
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.message || "Submission failed. Please try again.");
      }
      
    } 
    catch(error) {
      // Axios error handling
      const errorMessage = error.response?.data?.message || "Submission failed. Please try again.";
      toast.error(errorMessage);
      console.error("Club request submission failed:", error);
    }
  }

  if (isLoading) {
    return(
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/school/${schoolId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to University
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Request a New Club</h1>
          <p className="text-gray-600">
            Can't find your club? Help us expand our directory by requesting to add your club.
          </p>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Before you submit:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Make sure your club isn't already listed</li>
                <li>Provide accurate and complete information</li>
                <li>Your request will be reviewed by our team within 2-3 business days</li>
                <li>You'll receive an email confirmation once your club is approved</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-6">
              {/* Club Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                  Club Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter the full name of your club..."
                  value={clubData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  // required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleInputChange("categoryId", value)}>
                  <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                    <SelectValue placeholder="Select a category for your club..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700 mb-2 block">
                  Short Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Provide a brief description of what your club does..."
                  value={clubData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-24 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              {!isLoadingTag && 
                <div className="flex flex-wrap gap-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-2 block">
                    Select upto 3 tags (Please!)
                  </Label>
                  <div className="space-y-2 space-x-2">
                    {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      onClick={() => handleTagClick(tag.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                    </Button>
                  ))}
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Additional Details */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="meetingLocation" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meeting Location <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="meetingLocation"
                  type="text"
                  placeholder="Where does your club typically meet?"
                  value={clubData.meetingLocation}
                  onChange={(e) => handleInputChange("meetingLocation", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div> */}

          {/* Review Process Information */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">What happens next?</h3>
            <div className="space-y-2 text-blue-100">
              <p>• Our team will review your club request within 2-3 business days</p>
              <p>• We may reach out for additional information if needed</p>
              <p>• Once approved, your club will be added to the directory</p>
              <p>• You'll receive an email confirmation with next steps</p>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>By submitting this request, you confirm that the information provided is accurate.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
                  asChild
                >
                  <Link href={`/school/${schoolId}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
                  disabled={!isFormValid()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
