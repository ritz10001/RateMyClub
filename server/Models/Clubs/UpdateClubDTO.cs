using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;

namespace RateMyCollegeClub.Models.Clubs;

public class UpdateClubDTO : BaseClubDTO
{
    public bool? IsActive { get; set; }
    public int? CategoryId { get; set; }
    public string? LogoUrl { get; set; }
}