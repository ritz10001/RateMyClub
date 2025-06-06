

namespace RateMyCollegeClub.Models.Universities;

public class CreateUniversityDTO : BaseUniversityDTO
{
    public string LogoUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}