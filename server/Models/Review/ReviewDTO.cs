namespace RateMyCollegeClub.Models.Clubs;

public class ReviewDTO {
    public int Id { get; set; }
    public int LeadershipRating { get; set; }
    public int InclusivityRating { get; set; }
    public int NetworkingRating { get; set; }
    public int SkillsDevelopmentRating { get; set; }
    public int OverallRating { get; set;}
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ClubId { get; set; }
}