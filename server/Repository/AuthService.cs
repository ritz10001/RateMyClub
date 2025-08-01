using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
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
    private const string _loginProvider = "RateMyCollegeClub";
    private const string _refreshToken = "RefreshToken";
    private User _user;
    public AuthService(IMapper mapper, UserManager<User> userManager, IConfiguration configuration)
    {
        _mapper = mapper;
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<string> CreateRefreshToken()
    {      
        await _userManager.RemoveAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);
        _user.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(120);
        var newRefreshToken = await _userManager.GenerateUserTokenAsync(_user, _loginProvider, _refreshToken);
        await _userManager.SetAuthenticationTokenAsync(_user, _loginProvider, _refreshToken, newRefreshToken);
        await _userManager.UpdateAsync(_user);
        return newRefreshToken;
    }

    public async Task<AuthResponseDTO> Login(LoginDTO loginDTO)
    {
        _user = await _userManager.FindByEmailAsync(loginDTO.Email);
       
        if(_user == null){
            return null;
        }

        var isValidUser = await _userManager.CheckPasswordAsync(_user, loginDTO.Password);
        
        if (!isValidUser)
        {
            return null;
        }
        var token = await GenerateToken();
        var roles = await _userManager.GetRolesAsync(_user);
        // _user.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(120);
        // await _userManager.UpdateAsync(_user);
        return new AuthResponseDTO
        {
            Token = token,
            UserId = _user.Id,
            RefreshToken = await CreateRefreshToken(),
            FirstName = _user.FirstName,
            LastName = _user.LastName,
            Email = _user.Email,
            Roles = roles.ToList(),
            RefreshTokenExpiry = _user.RefreshTokenExpiry
        };
    }

    public async Task<(AuthResponseDTO, IEnumerable<IdentityError>, string confirmationUrl)> Register(UserDTO userDTO, string role = "User")
    {
        _user = _mapper.Map<User>(userDTO);
        _user.UserName = userDTO.Email;
        _user.Email = userDTO.Email;

        var result = await _userManager.CreateAsync(_user, userDTO.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(_user, role);
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(_user); //Generate Email confirmation token
            var encodedToken = WebUtility.UrlEncode(token);
            var confirmationUrl = $"https://localhost:3000/verify-email?email={_user.Email}&token={encodedToken}";
            var roles = await _userManager.GetRolesAsync(_user);

            var authResponse = new AuthResponseDTO
            {
                UserId = _user.Id,
                FirstName = _user.FirstName,
                LastName = _user.LastName,
                Email = _user.Email,
                Roles = roles.ToList()
            };
            return (authResponse, null, confirmationUrl);
        }


        return (null, result.Errors, null);
    }

    public async Task<AuthResponseDTO> VerifyRefreshToken(AuthResponseDTO request)
    {
        // 1. Find user by ID only (more secure than email/username)
        _user = await _userManager.FindByIdAsync(request.UserId);
        if (_user == null) return null;

        // 2. Verify the stored refresh token matches (one-time-use enforcement)
        var storedToken = await _userManager.GetAuthenticationTokenAsync(
            _user, 
            _loginProvider, 
            _refreshToken
        );
        
        if (storedToken != request.RefreshToken) 
        {
            await _userManager.UpdateSecurityStampAsync(_user); // Invalidate all tokens
            return null;
        }

        if (_user.RefreshTokenExpiry == null || DateTime.UtcNow > _user.RefreshTokenExpiry)
        {
            await _userManager.RemoveAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);
            await _userManager.UpdateAsync(_user);
            return null; // Refresh token expired
        }

        // 4. Generate new tokens (automatically invalidates old via CreateRefreshToken)
        return new AuthResponseDTO
        {
            Token = await GenerateToken(),
            RefreshToken = storedToken, // Rotates and invalidates old
            UserId = _user.Id,
            FirstName = _user.FirstName,
            LastName = _user.LastName,
            Email = _user.Email,
            Roles = (await _userManager.GetRolesAsync(_user)).ToList(),
            RefreshTokenExpiry = _user.RefreshTokenExpiry
        };
    }

    private async Task<string> GenerateToken(){
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var roles = await _userManager.GetRolesAsync(_user);
        var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x)).ToList();
        Console.WriteLine("ROLES FOR USER");
        foreach (var r in roleClaims)
        {
            Console.WriteLine(r);
        }
        var userClaims = await _userManager.GetClaimsAsync(_user);

        var claims = new List<Claim> 
        {
            new Claim(ClaimTypes.NameIdentifier, _user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, _user.Email),
            new Claim("uid", _user.Id)
        }.Union(userClaims).Union(roleClaims);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            signingCredentials: credentials,
            expires: DateTime.Now.AddSeconds(Convert.ToInt32(_configuration["JwtSettings:DurationInSeconds"]))
        );

        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    
}