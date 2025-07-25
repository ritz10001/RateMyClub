using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;

namespace RateMyCollegeClub.Models.Clubs;

public class UpdateClubDTO : BaseClubDTO
{
    public int? CategoryId { get; set; }
    public List<int> TagIds { get; set; } = [];
}