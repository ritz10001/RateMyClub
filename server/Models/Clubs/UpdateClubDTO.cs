using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class UpdateClubDTO : BaseClubDTO
{
    public int? CategoryId { get; set; }
    public List<int> TagIds { get; set; } = [];
}