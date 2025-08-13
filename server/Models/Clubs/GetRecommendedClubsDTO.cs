using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class GetRecommendedClubsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public List<string> Tags { get; set; } = [];

}