using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Universities;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    private readonly IClubsRepository _clubsRepository;
    public UniversityController(IMapper mapper, IUniversityRepository universityRepository, IClubsRepository clubsRepository)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
        _clubsRepository = clubsRepository;
    }

    [HttpGet]
    [Route("all-colleges")]
    public async Task<ActionResult<IEnumerable<GetUniversitiesDTO>>> GetUniversities()
    {
        var universities = await _universityRepository.GetUniversityDetails();
        var universitiesDTO = _mapper.Map<List<GetUniversitiesDTO>>(universities);
        return Ok(universitiesDTO);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetUniversityDTO>> GetUniversity(int id)
    {
        var university = await _universityRepository.GetIndividualUniversityDetails(id);
        var userId = GetUserId();

        if (university is null)
        {
            return NotFound();
        }

        var universityDTO = _mapper.Map<GetUniversityDTO>(university);
        HashSet<int> bookmarkedIds = new();
        if (!string.IsNullOrEmpty(userId))
        {
            bookmarkedIds = await _clubsRepository.GetBookmarkedClubIds(userId);
        }

        foreach (var clubDTO in universityDTO.Clubs)
        {
            clubDTO.IsBookmarked = bookmarkedIds.Contains(clubDTO.Id);
        }

        return Ok(universityDTO);
    }


    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<UniversitySearchDTO>>> SearchUniversities([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Query cannot be empty");
        }

        var universities = await _universityRepository.SearchByNameAsync(query);
        
        var results = universities.Select(u => new UniversitySearchDTO
        {
            Id = u.Id,
            Name = u.Name,
            Location = u.Location
        }).ToList();

        return Ok(results);
    }
    private string GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value ?? string.Empty;
    }
    private async Task<bool> UniversityExists(int id)
    {
        return await _universityRepository.Exists(id);
    }
}