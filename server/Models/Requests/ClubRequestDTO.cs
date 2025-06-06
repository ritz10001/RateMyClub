
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class ClubRequestDTO
{
    [Required, StringLength(100)]
    public string ClubName { get; set; } = string.Empty;
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string CategoryName { get; set; } = string.Empty;

}   