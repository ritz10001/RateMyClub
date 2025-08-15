using Microsoft.Identity.Client;

namespace RateMyCollegeClub.Models.Users;

public class UpdateUserInfoDTO
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? UniversityId { get; set; }
    public List<int>? TagIds { get; set; }
}

