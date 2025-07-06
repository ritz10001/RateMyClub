using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Interfaces;

public interface IAuthService
{
    Task<(AuthResponseDTO, IEnumerable<IdentityError>)> Register(UserDTO userDTO, string role);
    Task<AuthResponseDTO> Login(LoginDTO loginDTO);
    Task<string> CreateRefreshToken();
    Task<AuthResponseDTO> VerifyRefreshToken(AuthResponseDTO request);
    
}

