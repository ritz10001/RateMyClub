using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    private readonly UserManager<User> userManager;

    public SavedClubController(IMapper mapper, ISavedClubsRepository savedClubsRepository)
    {
        _mapper = mapper;
        _savedClubsRepository = savedClubsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SavedClubsDTO>>> GetSavedClubs()
    {
        var userId = GetUserId();
        Console.WriteLine("USER ID");
        Console.WriteLine(userId);
        var savedClubs = await _savedClubsRepository.GetSavedClubDetails(userId);
        var result = _mapper.Map<List<SavedClubsDTO>>(savedClubs);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> SaveClub(SavedClubsDTO savedClubsDTO)
    {
        var userId = GetUserId();
        var savedClub = _mapper.Map<SavedClub>(savedClubsDTO);
        savedClub.UserId = userId;
        Console.WriteLine(savedClub);
        await _savedClubsRepository.AddAsync(savedClub);
        return Ok();
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
}

