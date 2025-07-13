
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class GetClubRequestsDTO
{
    public string Name { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public List<GetTagDTO> Tags { get; set; } = [];
    public string Status { get; set; } 

}