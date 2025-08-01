using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Requests;
using RateMyCollegeClub.Models.Users;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityRequestController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRequestsRepository _universityRequestsRepository;
    public UniversityRequestController(IMapper mapper, IUniversityRequestsRepository universityRequestsRepository)
    {
        _mapper = mapper;
        _universityRequestsRepository = universityRequestsRepository;
    }

    [HttpGet("my-university-requests")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<GetMyUniversityRequestDTO>>> GetRequestsByUserId()
    {
        var userId = GetUserId();
        var requests = await _universityRequestsRepository.GetUniversityRequestByUser(userId);
        var result = _mapper.Map<List<GetMyUniversityRequestDTO>>(requests);
        return Ok(result);
    }
    [HttpPost]
    public async Task<IActionResult> CreateRequest(UniversityRequestDTO universityRequestDTO)
    {
        var request = _mapper.Map<UniversityRequest>(universityRequestDTO);
        request.UserId = GetUserId();
        await _universityRequestsRepository.AddAsync(request);
        return Ok(request);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> WithdrawRequest(int id)
    {
        var request = await _universityRequestsRepository.GetAsync(id);
        if (request == null)
        {
            return NotFound();
        }
        await _universityRequestsRepository.DeleteAsync(id);
        return NoContent();
    }
    private string? GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
    }
    
    
}