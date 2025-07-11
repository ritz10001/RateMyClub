using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class ClubRequest
{
    public int Id { get; set; }
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    public string MeetingLocation { get; set; } = string.Empty;
    public int UniversityId { get; set; }
    public University University { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; } // Assuming User is a class representing the user making the request
    public RequestStatus RequestStatus { get; set; } = RequestStatus.Pending;// 0: Pending, 1: Approved, 2: Rejected
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public string? RejectionReason { get; set; } 

}
