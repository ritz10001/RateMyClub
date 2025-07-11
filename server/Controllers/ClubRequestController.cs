using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]


public class ClubRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IClubRequestsRepository _clubRequestsRepository;

    public ClubRequestController(IMapper mapper, IClubRequestsRepository clubRequestsRepository)
    {
        _mapper = mapper;
        _clubRequestsRepository = clubRequestsRepository;
    }

    // [HttpGet]
    // public async Task<ActionResult<IEnumerable<GetClubRequestsDTO>>> GetRequests() {
    //     // var requests = await 
    // }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] ClubRequestDTO clubRequestDTO)
    {
        var request = new ClubRequest
        {
            Name = clubRequestDTO.ClubName,
            Description = clubRequestDTO.Description,
            CategoryId = clubRequestDTO.CategoryId,
            MeetingLocation = clubRequestDTO.MeetingLocation,
            UniversityId = clubRequestDTO.UniversityId,
            UserId = GetUserId(),
        };

        await _clubRequestsRepository.AddAsync(request);

        return Ok(request);
    }
    
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }

}