using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class GetClubDTO : BaseClubDTO{
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<GetReviewDTO> Reviews { get; set; } = [];
}