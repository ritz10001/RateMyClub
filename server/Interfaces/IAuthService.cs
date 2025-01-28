using Microsoft.AspNetCore.Identity;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Interfaces;

public interface IAuthService {
    Task<IEnumerable<IdentityError>> Register(UserDTO userDTO);
    Task<AuthResponseDTO> Login(LoginDTO loginDTO);
    
}

