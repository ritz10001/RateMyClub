using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class CreateClubDTO {
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClubLocation { get; set; } = string.Empty;
    [Required]
    public int CategoryId { get; set; }
}