

namespace RateMyCollegeClub.Models.SavedClubs;

using System.ComponentModel.DataAnnotations;
public class SavedClubsDTO
{
    public int ClubId { get; set; }
    public string ClubName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UniversityId { get; set; }
    public string UniversityName { get; set; } = string.Empty;
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public double AverageRating { get; set; } 
    public int ReviewCount { get; set; }  
    public List<string> Tags { get; set; } = [];
}

