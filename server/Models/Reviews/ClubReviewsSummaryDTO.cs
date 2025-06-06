using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Reviews;

public class ClubReviewsSummaryDTO
{
    // Final average (decimal)
    public decimal AverageOverallRating { get; set; }

    // Distribution uses INTEGERIZED values
    public Dictionary<int, int> StarDistribution { get; set; } = new()
    {
        { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 }
    };

    // Additional metrics
    public int TotalReviews { get; set; }
    public decimal AvgLeadershipRating { get; set; }
    public decimal AvgInclusivityRating { get; set; }
    public decimal AvgNetworkingRating { get; set; }
    public decimal AvgSkillsDevelopmentRating { get; set; }
}