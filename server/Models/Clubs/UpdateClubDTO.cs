using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models.Clubs;

public class UpdateClubDTO : BaseClubDTO {
    public bool? IsActive { get; set; }
}