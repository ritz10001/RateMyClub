
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;

namespace server.Models;

public class ReviewVote
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ReviewId { get; set; }
    public int Value { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public Review Review { get; set; } = null!;
}