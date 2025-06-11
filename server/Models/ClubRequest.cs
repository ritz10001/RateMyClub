using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class ClubRequest
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UniversityId { get; set; }
    public University University { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; } // Assuming User is a class representing the user making the request
    public RequestStatus RequestStatus { get; set; } // 0: Pending, 1: Approved, 2: Rejected
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

}
