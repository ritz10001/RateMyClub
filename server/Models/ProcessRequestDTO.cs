using System.ComponentModel.DataAnnotations;
using RateMyCollegeClub.Data;

namespace RateMyCollegeClub.Models;
public class ProcessRequestDto
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}