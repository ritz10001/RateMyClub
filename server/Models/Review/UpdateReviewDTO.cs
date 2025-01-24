namespace RateMyCollegeClub.Models.Reviews;

public class UpdateReviewDTO {
    public int LeadershipRating { get; set; }
    public int InclusivityRating { get; set; }
    public int NetworkingRating { get; set; }
    public int SkillsDevelopmentRating { get; set; }
    public int OverallRating { get; set;}
    public string Comment { get; set; } = string.Empty;
}