"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { app } from "@/app/utils/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    universityId: null,
    tagIds: [], // Selected tag IDs
  });
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [universities, setUniversities] = useState([]);
  const { user, updateUserData, isInitialized } = useAuth();
  const auth = getAuth(app);

  // Consolidated useEffect for data fetching and state initialization
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [universitiesRes, tagsRes] = await Promise.all([
          fetch(`http://localhost:5095/api/University/all-colleges`),
          fetch('http://localhost:5095/api/Tag')
        ]);

        const universitiesData = await universitiesRes.json();
        const tagsData = await tagsRes.json();

        setUniversities(universitiesData);
        setTags(tagsData);

        const stored = sessionStorage.getItem("combinedUserData");
        if (stored) {
          const data = JSON.parse(stored);
          const storedTagNames = data.tags || [];

          // Convert stored tag names to tag IDs using the fetched tagsData
          const matchedTagIds = tagsData
            .filter(tag => storedTagNames.includes(tag.name))
            .map(tag => tag.id);

          setProfileData({
            firstName: data.firstName,
            lastName: data.lastName,
            universityId: data.universityId || null,
            tagIds: matchedTagIds,
          });
          setSelectedTags(matchedTagIds);
        }
      } 
      catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Failed to load profile data.");
      } 
      finally {
        setIsLoading(false);
      }
    };
     fetchData();
  }, []); // Run only once on component mount

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagClick = (tagId) => {
    let updatedTags;
    if (selectedTags.includes(tagId)) {
      updatedTags = selectedTags.filter((id) => id !== tagId);
    } else {
      if (selectedTags.length >= 5) {
        toast.error("You can select up to 5 tags only.");
        return;
      }
      updatedTags = [...selectedTags, tagId];
    }
    setSelectedTags(updatedTags);
    setProfileData({ ...profileData, tagIds: updatedTags });
  };

  const handleSubmit = async () => {
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5095/api/Account/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          universityId: parseInt(profileData.universityId),
          tagIds: profileData.tagIds,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to update profile on server");
      }
      const updatedTagNames = tags
        .filter(tag => profileData.tagIds.includes(tag.id))
        .map(tag => tag.name);

      updateUserData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        universityId: parseInt(profileData.universityId),
        tags: updatedTagNames,
      });
      setProfileData(prevData => ({
        ...prevData,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        universityId: parseInt(profileData.universityId),
        tagIds: profileData.tagIds,
      }));
      toast.success("Profile updated successfully!", {
        duration: 5000
      });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getSelectedUniversity = () => {
    const uni = universities.find((u) => u.id === profileData.universityId);
    return uni ? uni.name : "Not selected";
  };

  const getSelectedTagNames = () => {
    return tags.filter((tag) => selectedTags.includes(tag.id)).map((tag) => tag.name);
  };

  if(!isInitialized){
    return(
       <div className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-12 border border-blue-100 dark:border-blue-900 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserRound className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Profile Found</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              You need to be logged in to view your profile. Please create an account or sign in to continue.
            </p>
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-semibold" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 py-3 rounded-xl font-semibold bg-transparent"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium underline underline-offset-4">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-zinc-950 dark:to-zinc-900 py-8">
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
        {/* Profile Photo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {(user && user.photoURL) ? (
              <img
                src={user.photoURL || "/placeholder.svg?height=120&width=120&text=Profile"}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserRound className="w-16 h-16 md:w-24 md:h-24 text-blue-600 dark:text-blue-400" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
            {profileData.firstName} {profileData.lastName}
          </h2>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">First Name</Label>
            {isEditing ? (
              <Input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100">
                {profileData.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Last Name</Label>
            {isEditing ? (
              <Input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100">
                {profileData.lastName}
              </div>
            )}
          </div>

          {/* University */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">University</Label>
            {isEditing ? (
              <Select
                value={profileData.universityId?.toString()}
                onValueChange={(value) => handleInputChange("universityId", value)}
              >
                <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select your university..." />
                </SelectTrigger>
                <SelectContent className="max-h-56 overflow-y-auto bg-white dark:bg-zinc-800 border-zinc-700">
                  {universities.map((university) => (
                    <SelectItem key={university.id} value={university.id.toString()} className="text-gray-900 dark:text-gray-100">
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100">
                {getSelectedUniversity()}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Interests</Label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    onClick={() => handleTagClick(tag.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                        : "border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                    }`}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl">
                {getSelectedTagNames().length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getSelectedTagNames().map((tagName, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tagName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No interests selected</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-8 justify-center">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}