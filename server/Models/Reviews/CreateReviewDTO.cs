using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Reviews;

public class CreateReviewDTO
{
    [Required, Range(1, 5)]
    public int LeadershipRating { get; set; }

    [Required, Range(1, 5)]
    public int InclusivityRating { get; set; }

    [Required, Range(1, 5)]
    public int NetworkingRating { get; set; }

    [Required, Range(1, 5)]
    public int SkillsDevelopmentRating { get; set; }
    [Required]
    public string Recommendation { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;
    [Required]
    public int ClubId { get; set; }
    public int NetScore { get; set; } = 0;
}