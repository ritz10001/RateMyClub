

using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class UniversityRequestDTO
{
    [Required, StringLength(100)]
    public string UniversityName { get; set; } = string.Empty;
    [StringLength(500)]
    public string AdditionalInfo { get; set; } = string.Empty;

}