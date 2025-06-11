using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Models.Clubs;

public class GetReviewDTO
{
    public int Id { get; set; }
    public int LeadershipRating { get; set; }  // Exact value
    public int InclusivityRating { get; set; }
    public int NetworkingRating { get; set; }
    public int SkillsDevelopmentRating { get; set; }
    public decimal OverallRating { get; set; }  // Calculated
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string UserDisplayName { get; set; } = string.Empty;
}