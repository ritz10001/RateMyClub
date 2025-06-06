

namespace RateMyCollegeClub.Models.SavedClubs;

using System.ComponentModel.DataAnnotations;
public class SavedClubsDTO
{
    public int Id { get; set; }
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public string Name { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
}

