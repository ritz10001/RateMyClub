

using System.ComponentModel.DataAnnotations;

namespace RateMyCollegeClub.Models;
public enum RequestStatus
{
    [Display(Name = "Pending")]
    Pending = 0,   // Request is pending approval
    [Display(Name = "Approved")]
    Approved = 1,  // Request has been approved
    [Display(Name = "Rejected")]
    Rejected = 2   // Request has been rejected
}   