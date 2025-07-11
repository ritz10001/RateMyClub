using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;

public class UniversityRequest
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AdditionalInfo { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public User? User { get; set; } // Assuming User is a class representing the user making the request
    public RequestStatus RequestStatus { get; set; } // 0: Pending, 1: Approved, 2: Rejected
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow; // ISO 8601 format for UTC time
}   

