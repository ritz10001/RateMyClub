using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Universities;
using RateMyCollegeClub.Utils;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UniversityController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IUniversityRepository _universityRepository;
    private readonly IClubsRepository _clubsRepository;
    private readonly UserManager<User> _userManager;
    public UniversityController(IMapper mapper, IUniversityRepository universityRepository, IClubsRepository clubsRepository, UserManager<User> userManager)
    {
        _mapper = mapper;
        _universityRepository = universityRepository;
        _clubsRepository = clubsRepository;
        _userManager = userManager;
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
    public async Task<ActionResult<GetUniversityDTO>> GetUniversityInfo(int id)
    {
        var university = await _universityRepository.GetUniversityBasicData(id);
        var result = _mapper.Map<GetUniversityDTO>(university);
        return Ok(result);
    }
    [HttpGet]
    [Route("paged")]
    public async Task<ActionResult<IEnumerable<GetUniversitiesDTO>>> GetPagedUniversities(int page = 1, int pageSize = 6, string? search = null)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and pageSize must be greater than zero.");
        }
        var universities = await _universityRepository.GetPagedUniversitiesAsync(page, pageSize, search);
        var totalCount = await _universityRepository.GetTotalUniversityCountAsync(search);
        var universitiesDTO = _mapper.Map<List<GetUniversitiesDTO>>(universities);
        var result = new
        {
            data = universitiesDTO,
            total = totalCount
        };
        return Ok(result);
    }
    [HttpGet("{id}/clubs")]
    public async Task<ActionResult<GetUniversityWithPagedClubsDTO>> GetPagedUniversityClubs(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 6, [FromQuery] string? search = null)
    {
        var university = await _universityRepository.GetIndividualUniversityDetails(id);
        if (university is null) return NotFound();

        var pagedClubs = await _clubsRepository.GetPagedClubsForUniversity(id, page, pageSize, search);
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }

        var mappedClubs = _mapper.Map<List<GetClubsDTO>>(pagedClubs.Items);

        // Add bookmark flags
        if (!string.IsNullOrEmpty(user?.Id))
        {
            var bookmarkedIds = await _clubsRepository.GetBookmarkedClubIds(user.Id);
            foreach (var clubDTO in mappedClubs)
            {
                clubDTO.IsBookmarked = bookmarkedIds.Contains(clubDTO.Id);
            }
        }

        // Package paginated response
        var pagedClubsDTO = new PagedResult<GetClubsDTO>
        {
            Items = mappedClubs,
            TotalCount = pagedClubs.TotalCount,
            Page = pagedClubs.Page,
            PageSize = pagedClubs.PageSize
        };

        var response = new GetUniversityWithPagedClubsDTO
        {
            University = _mapper.Map<GetUniversityDTO>(university),
            Clubs = pagedClubsDTO
        };

        return Ok(response);
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