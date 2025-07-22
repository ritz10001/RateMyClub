
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class GetClubRequestsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public int UniversityId { get; set; }
    public string Category { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ClubLocation { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public List<GetTagDTO> Tags { get; set; } = [];
    public string Status { get; set; } 

}