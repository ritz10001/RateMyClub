
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class GetMyClubRequestsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public int Status { get; set; }
    public string RejectionReason { get; set; } = string.Empty;

}