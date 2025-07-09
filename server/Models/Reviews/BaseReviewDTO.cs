using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Reviews;

public abstract class BaseReviewDTO
{
    [Required]
    [Range(1, 5)]
    public int LeadershipRating { get; set; }
    [Required]
    [Range(1, 5)]
    public int InclusivityRating { get; set; }
    [Required]
    [Range(1, 5)]
    public int NetworkingRating { get; set; }
    [Required]
    [Range(1, 5)]
    public int SkillsDevelopmentRating { get; set; }
    [MaxLength(1000)]
    public string Comment { get; set; } = string.Empty;
    public string Recommendation { get; set; } = string.Empty;
}

