using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class CreateClubDTO : BaseClubDTO {
    [Required]
    public int UniversityId { get; set; }
    [Required]
    public int CategoryId { get; set; }
}