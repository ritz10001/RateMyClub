using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class GetClubDTO : BaseClubDTO
{
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new() { { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 } };
    public List<GetReviewDTO> Reviews { get; set; } = [];
    public List<string> Tags { get; set; } = [];
    public string ClubLocation { get; set; } = string.Empty;
}