using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.SavedClubs;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class SavedClubController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly ISavedClubsRepository _savedClubsRepository;
    private readonly UserManager<User> _userManager;

    public SavedClubController(IMapper mapper, ISavedClubsRepository savedClubsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _savedClubsRepository = savedClubsRepository;
        _userManager = userManager;
    }


    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<SavedClubsDTO>>> GetSavedClubs()
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        if (string.IsNullOrEmpty(firebaseUid))
            return Unauthorized();

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        if (user == null)
            return Unauthorized();

        var savedClubs = await _savedClubsRepository.GetSavedClubDetails(user.Id);
        var result = _mapper.Map<List<SavedClubsDTO>>(savedClubs);
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<bool>> SaveClub(SaveClubRequest saveClubRequest)
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        if (string.IsNullOrEmpty(firebaseUid))
            return Unauthorized();

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        Console.WriteLine("THIS IS THE USER ID");
        Console.WriteLine(user.Id);
        if (user == null)
            return Unauthorized();

        var savedClub = new SavedClub
        {
            ClubId = saveClubRequest.ClubId,
            UserId = user.Id,
            SavedAt = DateTime.UtcNow
        };

        await _savedClubsRepository.AddAsync(savedClub);
        return Ok(true);
    }

    [HttpDelete]
    [Authorize]
    public async Task<ActionResult<bool>> DeleteSavedClubByClubId([FromBody] SaveClubRequest saveClubRequest)
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        if (string.IsNullOrEmpty(firebaseUid))
            return Unauthorized();

        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        if (user == null)
            return Unauthorized();

        var savedClub = await _savedClubsRepository.GetSavedClubById(saveClubRequest.ClubId, user.Id);
        if (savedClub == null)
            return NotFound();

        await _savedClubsRepository.DeleteAsync(savedClub.Id);
        return Ok(false);
    }

    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
}

