using RateMyCollegeClub.Models.Users;

public class RegisterResponseDTO
{
    public AuthResponseDTO AuthResponse { get; set; }
    public string ConfirmationUrl { get; set; }
}
