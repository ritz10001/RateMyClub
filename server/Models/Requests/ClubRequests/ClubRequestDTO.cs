
using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Requests;

public class ClubRequestDTO
{
    public string FullName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int UniversityId { get; set; }
    public List<int> TagIds { get; set; } = [];

}   