"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Pencil, Save, X, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import { app } from "@/app/utils/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AuthRoute from "../components/AuthRoute";

export default function UserProfilePage() {
  return (
    <AuthRoute>
      <ProfilePage />
    </AuthRoute>
  );
}

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    universityId: null,
    // profilePhoto: "/placeholder.svg?height=120&width=120&text=JD",
    tagIds: [], // Selected tag IDs
  });
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTags, setSelectedTags] = useState([1, 2, 5]);
  const [universities, setUniversities] = useState([]);
  const { user, updateUserData } = useAuth();
  const auth = getAuth(app);
  console.log("HERE IS FULL USER DATA", user);

  useEffect(() => {
    const stored = sessionStorage.getItem("combinedUserData");
    if(stored){
      const data = JSON.parse(stored);
      console.log("Stored profile data:", data);
      setProfileData({
        firstName: data.firstName,
        lastName: data.lastName,
        universityId: data.universityId || null,
        tags: data.tags || [],
        profilePhoto: data.photoURL || null
      })
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5095/api/University/all-colleges`)
    .then(res => res.json())
    .then(data => {
      console.log("UNIS", data);
      setUniversities(data);
    });
    fetch('http://localhost:5095/api/Tag')
      .then(res => res.json())
      .then(data => {
      console.log(data);
      setTags(data);
    });
    setIsLoading(false);
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(profileData);
  };

  const handleTagClick = (tagId) => {
    let updatedTags;
    if (selectedTags.includes(tagId)) {
      updatedTags = selectedTags.filter((id) => id !== tagId);
    } 
    else {
      if (selectedTags.length >= 5) {
        toast.error("You can select up to 5 tags only.");
        return;
      }
      updatedTags = [...selectedTags, tagId];
    }
    setSelectedTags(updatedTags);
    setProfileData({ ...profileData, tagIds: updatedTags });
  }

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
      // Update the AuthContext so all components reflect the new info immediately
      updateUserData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        universityId: parseInt(profileData.universityId),
        tags: profileData.tagIds,
      });
      console.log("Saving profile:", profileData)
      toast.success("Profile updated successfully!", {
        duration: 5000
      });
      setIsEditing(false);
      // router.push("/user-profile");
    } 
    catch (error) {
      toast.error("Failed to update profile. Please try again.")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const getSelectedUniversity = () => {
    console.log("universities", universities);
    const uni = universities.find((u) => u.id === profileData.universityId);
    return uni ? uni.name : "Not selected";
  }

  const getSelectedTagNames = () => {
    return tags.filter((tag) => selectedTags.includes(tag.id)).map((tag) => tag.name)
  }

  if (isLoading) { 
    return (
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="font-bold text-xl">Now Loading..</p>
        </div>
      </div>
    ); 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          {/* Profile Photo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {(user && user.photoURL) ? (
                <img
                  src={user.photoURL || "/placeholder.svg?height=120&width=120&text=Profile"}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                ) 
                : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserRound className="w-16 h-16 md:w-24 md:h-24 text-blue-600" />
                </div>
                )
              }
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              {profileData.firstName} {profileData.lastName}
            </h2>
          </div>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">First Name</Label>
              {isEditing ? (
                <Input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                  {profileData.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</Label>
              {isEditing ? (
                <Input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                  {profileData.lastName}
                </div>
              )}
            </div>

            {/* University */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">University</Label>
              {isEditing ? (
                <Select
                  value={profileData.universityId?.toString()}
                  onValueChange={(value) => handleInputChange("universityId", value)}
                >
                  <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500">
                    <SelectValue placeholder="Select your university..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 overflow-y-auto">
                    {universities.map((university) => (
                      <SelectItem key={university.id} value={university.id.toString()}>
                        {university.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                  {getSelectedUniversity()}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Interests (Select up to 5 tags)</Label>
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
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border-blue-200 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                  {getSelectedTagNames().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedTagNames().map((tagName, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tagName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No interests selected</span>
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
                className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
