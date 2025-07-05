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
        var newRefreshToken = await _userManager.GenerateUserTokenAsync(_user, _loginProvider, _refreshToken);
        var result = await _userManager.SetAuthenticationTokenAsync(_user, _loginProvider, _refreshToken, newRefreshToken);
        return newRefreshToken;
    }

    public async Task<AuthResponseDTO> Login(LoginDTO loginDTO)
    {
        _user = await _userManager.FindByEmailAsync(loginDTO.Email);
       
        var isValidUser = await _userManager.CheckPasswordAsync(_user, loginDTO.Password);

        if(_user == null || isValidUser == false){
            return null;
        }
        var token = await GenerateToken();
        return new AuthResponseDTO
        {
            Token = token,
            UserId = _user.Id,
            RefreshToken = await CreateRefreshToken()

        };
    }

    public async Task<IEnumerable<IdentityError>> Register(UserDTO userDTO, string role = "User")
    {
        _user = _mapper.Map<User>(userDTO);
        
        _user.UserName = userDTO.Email;

        var result = await _userManager.CreateAsync(_user, userDTO.Password);

        if(result.Succeeded){
            await _userManager.AddToRoleAsync(_user, role);
        }

        return result.Errors;
    }

    public async Task<AuthResponseDTO> VerifyRefreshToken(AuthResponseDTO request)
    {
        var jwtSecutityTokenHandler = new JwtSecurityTokenHandler();
        var tokenContent = jwtSecutityTokenHandler.ReadJwtToken(request.Token);
        var userName = tokenContent.Claims.ToList().FirstOrDefault(q => q.Type == JwtRegisteredClaimNames.Email)?.Value;
        _user = await _userManager.FindByNameAsync(userName);

        if (_user == null || _user.Id != request.UserId)
        {
            return null;
        }
        var isValidRefreshToken = await _userManager.VerifyUserTokenAsync(_user, _loginProvider, _refreshToken, request.RefreshToken);

        if (isValidRefreshToken)
        {
            var token = await GenerateToken();
            return new AuthResponseDTO
            {
                Token = token,
                UserId = _user.Id,
                RefreshToken = await CreateRefreshToken()
            };
        }

        await _userManager.UpdateSecurityStampAsync(_user);
        return null;
    }

    private async Task<string> GenerateToken(){
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var roles = await _userManager.GetRolesAsync(_user);
        var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x)).ToList();
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
            expires: DateTime.Now.AddMinutes(Convert.ToInt32(_configuration["JwtSettings:DurationInMinutes"]))
        );

        return new JwtSecurityTokenHandler().WriteToken(token);

    }
}