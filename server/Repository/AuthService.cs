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
using Azure;
using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;

namespace RateMyCollegeClub.Repository;

public class AuthService : IAuthService
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
    private readonly FirebaseAuthService _firebaseAuthService;
    private readonly IConfiguration _configuration;
    private const string _loginProvider = "RateMyCollegeClub";
    private const string _refreshToken = "RefreshToken";
    private User _user;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public AuthService(IMapper mapper, UserManager<User> userManager, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, FirebaseAuthService firebaseAuthService)
    {
        _mapper = mapper;
        _userManager = userManager;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _firebaseAuthService = firebaseAuthService;
    }

    public async Task<string> CreateRefreshToken()
    {      
        await _userManager.RemoveAuthenticationTokenAsync(_user, _loginProvider, _refreshToken);
        // _user.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(1);
        var baseToken = await _userManager.GenerateUserTokenAsync(_user, _loginProvider, _refreshToken);
        var newRefreshToken = $"{_user.Id}.{baseToken}";
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
        var refreshToken = await CreateRefreshToken();
        var roles = await _userManager.GetRolesAsync(_user);
        var jwtExpiry = Convert.ToInt32(_configuration["JwtSettings:DurationInSeconds"]);

        Console.WriteLine("=== SETTING COOKIES ===");
        Console.WriteLine($"Token: {token.Substring(0, 20)}..."); // Show first 20 chars
        Console.WriteLine($"RefreshToken: {refreshToken.Substring(0, 10)}..."); // Show first 10 chars
        Console.WriteLine($"JWT Expiry: {DateTime.UtcNow.AddSeconds(jwtExpiry)}");
        // Console.WriteLine($"Refresh Expiry: {_user.RefreshTokenExpiry}");
        // Cookie Setup
        _httpContextAccessor.HttpContext.Response.Cookies.Append("authToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddSeconds(jwtExpiry),
            Path = "/"
        });
        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddMinutes(1),
            Path = "/"
        });

        Console.WriteLine("=== COOKIES SET ===");
        return new AuthResponseDTO
        {
            // Token = token,
            UserId = _user.Id,
            // RefreshToken = refreshToken,
            FirstName = _user.FirstName,
            LastName = _user.LastName,
            Email = _user.Email,
            Roles = roles.ToList(),
            // RefreshTokenExpiry = _user.RefreshTokenExpiry
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

    public async Task<AuthResponseDTO> FirebaseRegister(FirebaseRegisterDTO firebaseRegisterDTO, string role = "User")
    {
        FirebaseToken decodedToken;
        try
        {
            decodedToken = await _firebaseAuthService.VerifyIdTokenAsync(firebaseRegisterDTO.FirebaseIdToken);
        }
        catch
        {
            return new AuthResponseDTO
            {
                Message = "Invalid Firebase ID Token"
            };
        }
        var firebaseUid = decodedToken.Uid;
        var emailFromToken = decodedToken.Claims.TryGetValue("email", out var emailObj) ? emailObj?.ToString() : null;
        var email = emailFromToken ?? firebaseRegisterDTO.Email;

        var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        if (existingUser != null)
        {
            return new AuthResponseDTO
            {
                Message = "User already Exists!"
            };
        }
        var newUser = new User
        {
            FirstName = firebaseRegisterDTO.FirstName,
            LastName = firebaseRegisterDTO.LastName,
            Email = firebaseRegisterDTO.Email,
            FireBaseUid = firebaseUid,
            UniversityId = firebaseRegisterDTO.UniversityId ?? 0,
            SchoolName = firebaseRegisterDTO.SchoolName ?? ""
        };
        var result = await _userManager.CreateAsync(newUser);
        if (!result.Succeeded)
        {
            return new AuthResponseDTO
            {
                Message = "User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description))
            };
        }
        await _userManager.AddToRoleAsync(newUser, role);
        var roles = await _userManager.GetRolesAsync(newUser);
        return new AuthResponseDTO
        {
            UserId = newUser.Id,
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Roles = roles.ToList(),
            Message = "Registration Successful"
        };
    }

    public async Task<AuthResponseDTO?> FirebaseLogin(string firebaseIdToken)
    {
        FirebaseToken decodedToken;
        try
        {
            decodedToken = await _firebaseAuthService.VerifyIdTokenAsync(firebaseIdToken);
        }
        catch
        {
            return null; // invalid token
        }

        var firebaseUid = decodedToken.Uid;

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        if (user == null)
        {
            return null; // user doesn't exist yet
        }

        var roles = await _userManager.GetRolesAsync(user);;

        return new AuthResponseDTO
        {
            UserId = user.Id,
            Email = user.Email ?? "",
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToList(),
            Message = "Login successful"
        };
    }

    public async Task<AuthResponseDTO> VerifyRefreshToken(string userId)
    {
        _user = await _userManager.FindByIdAsync(userId);
        if (_user == null)
        {
            Console.WriteLine("User not found");
            return null;
        }

        var newToken = await GenerateToken();
        Console.WriteLine("THIS IS THE JWT TOKEN", newToken);
        var newRefreshToken = await CreateRefreshToken();
        var jwtExpiry = Convert.ToInt32(_configuration["JwtSettings:DurationInSeconds"]);

        // Use consistent cookie settings
        _httpContextAccessor.HttpContext.Response.Cookies.Append("authToken", newToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Match your login settings
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddSeconds(jwtExpiry),
            Path = "/"
        });

        _httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Match your login settings
            SameSite = SameSiteMode.Lax,
            // Expires = _user.RefreshTokenExpiry,
            Path = "/"
        });

        return new AuthResponseDTO
        {
            UserId = _user.Id,
            FirstName = _user.FirstName,
            LastName = _user.LastName,
            Email = _user.Email,
            Roles = (await _userManager.GetRolesAsync(_user)).ToList(),
            // Token = newToken
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