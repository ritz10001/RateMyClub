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
using Microsoft.AspNetCore.Mvc.Routing;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;

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
    private readonly ITagsRepository _tagsRepository;
    private readonly IUniversityRepository _universityRepository;
    private readonly IEmailService _emailService;
    public AuthService(IMapper mapper, UserManager<User> userManager,
    IConfiguration configuration, IHttpContextAccessor httpContextAccessor,
    FirebaseAuthService firebaseAuthService, ITagsRepository tagsRepository,
    IUniversityRepository universityRepository, IEmailService emailService)
    {
        _mapper = mapper;
        _userManager = userManager;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _firebaseAuthService = firebaseAuthService;
        _tagsRepository = tagsRepository;
        _universityRepository = universityRepository;
        _emailService = emailService;
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

    public async Task<(bool Success, string ErrorMessage)> ResendVerification(string email)
    {
        Console.WriteLine("In the resend verification");
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null)
        {
            Console.WriteLine("User does not exist");
            return (false, "User not found.");
        }

        var fbUser = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
        if (fbUser.EmailVerified)
        {
            Console.WriteLine("User email is not verified");
            return (false, "Email already verified.");
        }

        var verificationLink = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(email);
        Console.WriteLine("Failed to create Verification Link");
        string firstName = user.FirstName ?? "User";

        var emailSent = await _emailService.SendVerificationEmailAsync(email, firstName, verificationLink);

        if (!emailSent)
        {
            Console.WriteLine("Failed to send email");
            return (false, "Failed to send verification email.");
        }

        return (true, null);
    }
    public async Task<(AuthResponseDTO, IEnumerable<IdentityError>, string confirmationUrl)> FirebaseRegister(FirebaseRegisterDTO firebaseRegisterDTO, string role = "User")
    {
        // 1) Verify the Firebase ID token from client
        Console.WriteLine("IN STEP 1, VERIFYING FB ID");
        FirebaseToken decodedToken;
        try
        {
            decodedToken = await _firebaseAuthService.VerifyIdTokenAsync(firebaseRegisterDTO.FirebaseIdToken);
        }
        catch
        {
            return (null, new List<IdentityError>
            {
                new IdentityError { Code = "InvalidToken", Description = "Invalid Firebase ID Token" }
            }, null);
        }

        var firebaseUid = decodedToken.Uid;
        var emailFromToken = decodedToken.Claims.TryGetValue("email", out var emailObj) ? emailObj?.ToString() : null;
        var email = emailFromToken ?? firebaseRegisterDTO.Email;

        // 2) Prevent duplicate registrations
        Console.WriteLine("IN STEP 2, PREVENTING DUPLICATIONS");
        var userByUidExists = await _userManager.Users.AnyAsync(u => u.FireBaseUid == firebaseUid);
        Console.WriteLine($"User exists by Firebase UID: {userByUidExists}");
        if (userByUidExists)
        {
            return (null, new List<IdentityError>
            {
                new IdentityError { Code = "UserExists", Description = "User already exists." }
            }, null);
        }
        var userByEmail = await _userManager.FindByEmailAsync(email);
        Console.WriteLine($"User exists by Email: {userByEmail != null}");
        if (userByEmail != null)
        {
            return (null, new List<IdentityError>
            {
                new IdentityError { Code = "EmailExists", Description = "An account with this email already exists." }
            }, null);
        }

        // 3) Resolve tags & university
        Console.WriteLine("IN STEP 3, RESOLVING TAGS");
        var tags = await _tagsRepository.GetTagsByIdsAsync(firebaseRegisterDTO.TagIds);
        var universityName = await _universityRepository.GetUniversityNameByIdAsync(firebaseRegisterDTO.UniversityId ?? 0);
        // 4) Create SQL user record
        Console.WriteLine("IN STEP 4, CREATING SQL RECORDS");
        var newUser = new User
        {
            UserName = firebaseRegisterDTO.Email,
            FirstName = firebaseRegisterDTO.FirstName,
            LastName = firebaseRegisterDTO.LastName,
            Email = firebaseRegisterDTO.Email,
            FireBaseUid = firebaseUid,
            UniversityId = firebaseRegisterDTO.UniversityId ?? 0,
            Tags = tags,
            SchoolName = universityName
        };

        var result = await _userManager.CreateAsync(newUser);
        if (!result.Succeeded)
        {
            return (null, result.Errors, null);
        }

        await _userManager.AddToRoleAsync(newUser, "User");
        var roles = await _userManager.GetRolesAsync(newUser);

        var verificationLink = await FirebaseAuth.DefaultInstance.GenerateEmailVerificationLinkAsync(email);

        // 4.6) Send via your custom service
        var emailSent = await _emailService.SendVerificationEmailAsync(email, newUser.FirstName, verificationLink);
        if (!emailSent)
        {
            // Consider removing the user if email fails
            await _userManager.DeleteAsync(newUser);
            return (null, new List<IdentityError>
            {
                new IdentityError { Code = "EmailFailed", Description = "Failed to send verification email." }
            }, null);
        }

        // 5) Return auth response & link
        string confirmationUrl = $"http://localhost:3000/email-confirmation?uid={WebUtility.UrlEncode(firebaseUid)}";
        Console.WriteLine("IN STEP 5, RETURNING AUTH RESPONSE");
        var authResponse = new AuthResponseDTO
        {
            UserId = newUser.Id,
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Roles = roles.ToList(),
            Message = "Registration Successful - Please verify your email.",
            Tags = tags.Select(t => t.Name).ToList()
        };

        return (authResponse, null, confirmationUrl);
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
            return null; // Invalid token
        }

        var firebaseUid = decodedToken.Uid;

        // Check SQL user exists
        var user = await _userManager.Users.Include(u => u.Tags).FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        if (user == null) return null;

        // Verify with Firebase that email is confirmed
        var fbUser = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserAsync(firebaseUid);
        if (!fbUser.EmailVerified)
        {
            Console.WriteLine("Email not verified");
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        Console.WriteLine("THESE ARE THE TAGS");
        foreach (var t in user.Tags)
        {
            Console.WriteLine(t.Name);
        }

        return new AuthResponseDTO
        {
            UserId = user.Id,
            Email = user.Email ?? "",
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToList(),
            Message = "Login successful",
            Tags = user.Tags.Select(t => t.Name).ToList()
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