
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class GetClubRequestsDTO
{
    public string ClubName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public string Status { get; set; } 

}