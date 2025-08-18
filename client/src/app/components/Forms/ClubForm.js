"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Info, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"


export default function ClubForm({ clubData, setClubData, handleSubmit, submitLabel = "Submit", universities, categories, tags, selectedTags, setSelectedTags, isEditMode }) {

  const handleInputChange = (field, value) => {
    setClubData((prev) => ({
        ...prev,
        [field]: value,
    }));
    };
  const handleTagClick = (tagId) => {
    let updatedTags;
    if (selectedTags.includes(tagId)) {
        updatedTags = selectedTags.filter((id) => id !== tagId);
    } 
    else {
      if (selectedTags.length >= 3) {
        toast.error("You can select up to 3 tags only.");
        return;
      }
      updatedTags = [...selectedTags, tagId];
    }
    setSelectedTags(updatedTags);
    setClubData({ ...clubData, tagIds: updatedTags });
  };

  const isFormValid = () => {
    const {name, description, clubLocation, universityId, categoryId, tagIds} = clubData;
    const baseValid = name.trim().length > 3 &&
    description.trim().length >= 20 &&
    clubLocation &&
    !!categoryId &&
    tagIds.length > 0;
    
    if(isEditMode){
      return baseValid;
    }
    else{
      return baseValid && !!universityId;
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Club Information</h2>
        <div className="space-y-6">
          {/* Club Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Club Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter the full official name of the university..."
              value={clubData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400"
              required
            />
          </div>
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Description..."
              value={clubData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400"
              required
            />
          </div>
          {/* Club Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="City, State (e.g., Austin, TX)"
              value={clubData.clubLocation}
              onChange={(e) => handleInputChange("clubLocation", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-8 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400"
              required
            />
          </div>
          {/* University Selection */}
          {!isEditMode &&
            <div>
              <Label htmlFor="university" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                University <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleInputChange("universityId", value)}>
                <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:border-blue-400">
                  <SelectValue placeholder="Select a University..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  {universities.map((university) => (
                    <SelectItem key={university.id} value={university.id.toString()} className="dark:text-gray-100 dark:hover:bg-zinc-700">
                      {university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={isEditMode ? clubData.categoryId.toString() : undefined} onValueChange={(value) => handleInputChange("categoryId", value)}>
              <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-100 dark:focus:border-blue-400">
                <SelectValue placeholder="Select a category for your club..." />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()} className="dark:text-gray-100 dark:hover:bg-zinc-700">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Tag Selection */}
          <div className="flex flex-wrap gap-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block w-full">
              Select up to 3 tags <span className="text-red-400">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 w-full mb-5">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  onClick={() => handleTagClick(tag.id)}
                  className={`rounded-full px-4 py-2 min-w-[80px] text-sm font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900"
                  }`}
                >
                  {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold bg-transparent dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
              asChild
            >
              <Link href="/all-schools">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={!isFormValid()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
