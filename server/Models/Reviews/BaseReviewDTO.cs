using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Reviews;

public abstract class BaseReviewDTO {
    [Required]
    public int LeadershipRating { get; set; }
    [Required]
    public int InclusivityRating { get; set; }
    [Required]
    public int NetworkingRating { get; set; }
    [Required]
    public int SkillsDevelopmentRating { get; set; }
    [Required]
    public int OverallRating { get; set;}
    public string Comment { get; set; } = string.Empty;
}

