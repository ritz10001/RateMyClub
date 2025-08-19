

using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Models.Universities;

public class GetUniversityDTO : BaseUniversityDTO
{
    public int Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public int ClubsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Description { get; set; } = string.Empty;
    public string OfficialWebsite { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}