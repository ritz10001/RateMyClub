using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Repository;

public class AuthService : IAuthService
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    public AuthService(IMapper mapper, UserManager<User> userManager, IConfiguration configuration)
    {
        _mapper = mapper;   
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<AuthResponseDTO> Login(LoginDTO loginDTO)
    {
        var user = await _userManager.FindByEmailAsync(loginDTO.Email);
       
        var isValidUser = await _userManager.CheckPasswordAsync(user, loginDTO.Password);

        if(user == null || isValidUser == false){
            return null;
        }
        var token = await GenerateToken(user);
        return new AuthResponseDTO
        {
            Token = token,
            UserId = user.Id
        };
    }

    public async Task<IEnumerable<IdentityError>> Register(UserDTO userDTO)
    {
        var user = _mapper.Map<User>(userDTO);
        
        user.UserName = userDTO.Email;

        var result = await _userManager.CreateAsync(user, userDTO.Password);

        if(result.Succeeded){
            await _userManager.AddToRoleAsync(user, "User");
        }

        return result.Errors;
    }

    private async Task<string> GenerateToken(User user){
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var roles = await _userManager.GetRolesAsync(user);
        var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x)).ToList();
        var userClaims = await _userManager.GetClaimsAsync(user);

        var claims = new List<Claim> 
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("uid", user.Email)
        }.Union(userClaims).Union(roleClaims);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToInt32(_configuration["JwtSettings:DurationInMinutes"]))
        );

        return new JwtSecurityTokenHandler().WriteToken(token);

    }
}