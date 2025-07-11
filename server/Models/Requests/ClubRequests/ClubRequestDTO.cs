
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class ClubRequestDTO
{
    [Required]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Club name must be between 3-100 characters")]
    public string ClubName { get; set; } = string.Empty;

    [Required]
    [StringLength(500, MinimumLength = 20, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please select a category")]
    public int CategoryId { get; set; }

    [Required]
    [StringLength(100)]
    public string MeetingLocation { get; set; } = string.Empty;
    public int UniversityId { get; set; }

}   