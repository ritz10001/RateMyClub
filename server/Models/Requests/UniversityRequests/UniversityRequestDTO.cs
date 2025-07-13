

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace RateMyCollegeClub.Models.Requests;

public class UniversityRequestDTO
{
    public string FullName { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public UniversityType UniversityType { get; set; } = UniversityType.Public;
    public string Location { get; set; } = string.Empty;
    public string? OfficialWebsite { get; set; } = string.Empty;
    public string? AdditionalInfo { get; set; } = string.Empty;

}