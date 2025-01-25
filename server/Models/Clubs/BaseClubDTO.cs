using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public abstract class BaseClubDTO {
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClubLocation { get; set; } = string.Empty;
    [Required]
    public int CategoryId { get; set; }
}