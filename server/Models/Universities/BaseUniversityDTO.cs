

using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Universities;

public abstract class BaseUniversityDTO
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;
    [Required, StringLength(1000)]
    public string Location { get; set; } = string.Empty;
}

