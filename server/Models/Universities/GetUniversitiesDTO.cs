

using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Universities;

public class GetUniversitiesDTO : BaseUniversityDTO
{
    public int Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public int ClubsCount { get; set; }
    public int ReviewCount { get; set; }
}