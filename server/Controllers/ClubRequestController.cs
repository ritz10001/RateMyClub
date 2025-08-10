using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RateMyCollegeClub.Data;
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
    private readonly ITagsRepository _tagsRepository;
    private readonly UserManager<User> _userManager;
    public ClubRequestController(IMapper mapper, IClubRequestsRepository clubRequestsRepository, ITagsRepository tagsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _clubRequestsRepository = clubRequestsRepository;
        _tagsRepository = tagsRepository;
        _userManager = userManager;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubRequestsDTO>>> GetAllRequests()
    {
        var requests = await _clubRequestsRepository.GetClubRequestsInformation();
        var result = _mapper.Map<List<GetClubRequestsDTO>>(requests);

        for (int i = 0; i < requests.Count; i++)
        {
            var request = requests[i];
            var dto = result[i];

            List<int> tagIds = [];

            if (!string.IsNullOrEmpty(request.TagIdsJson))
            {
                tagIds = JsonSerializer.Deserialize<List<int>>(request.TagIdsJson) ?? [];
            }

            var tags = await _tagsRepository.GetTagsByIdsAsync(tagIds);
            var tagDTOs = _mapper.Map<List<GetTagDTO>>(tags);
            dto.Tags = tagDTOs;
        }
        return Ok(result);
    }
    [HttpGet("my-club-requests")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<GetMyClubRequestsDTO>>> GetRequestsByUserId()
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        var userId = user?.Id;
        var requests = await _clubRequestsRepository.GetClubRequestByUser(userId);
        var results = _mapper.Map<List<GetMyClubRequestsDTO>>(requests);
        return Ok(results);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateRequest([FromBody] ClubRequestDTO clubRequestDTO)
    {
        // var tags = await _tagsRepository.GetTagsByIdsAsync(clubRequestDTO.TagIds);
        Console.WriteLine("ENTERED THE METHOD");
        var request = _mapper.Map<ClubRequest>(clubRequestDTO);
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        else
        {
            Console.WriteLine("NO FIREBASE ID WAS DECODED");
        }
        // request.Tags = tags;
        Console.WriteLine("THIS IS THE USER ID");
        Console.WriteLine(user.Id);
        request.UserId = user?.Id;
        request.TagIdsJson = JsonSerializer.Serialize(clubRequestDTO.TagIds);

        await _clubRequestsRepository.AddAsync(request);

        return Ok(new { message = "Club request submitted successfully." });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> WithdrawRequest(int id)
    {
        var request = await _clubRequestsRepository.GetAsync(id);
        if (request == null)
        {
            return NotFound();
        }
        await _clubRequestsRepository.DeleteAsync(id);
        return NoContent();
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }

}