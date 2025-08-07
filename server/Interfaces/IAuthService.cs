using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Interfaces;

public interface IAuthService
{
    Task<(AuthResponseDTO, IEnumerable<IdentityError>, string confirmationUrl)> Register(UserDTO userDTO, string role);
    Task<AuthResponseDTO> Login(LoginDTO loginDTO);
    Task<string> CreateRefreshToken();
    Task<AuthResponseDTO> VerifyRefreshToken(string refreshToken);
    Task<(AuthResponseDTO, IEnumerable<IdentityError>, string confirmationUrl)> FirebaseRegister(FirebaseRegisterDTO firebaseRegisterDTO, string role);
    Task<AuthResponseDTO> FirebaseLogin(string firebaseIdToken);
    
}

