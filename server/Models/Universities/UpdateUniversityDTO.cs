

namespace RateMyCollegeClub.Models.Universities;

public class UpdateUniversityDTO : BaseUniversityDTO
{
    public int Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

}   