using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class ReviewFlag {
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public Review Review { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string Reason { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}


    