using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Repository;
using RateMyCollegeClub.Utils;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase
{

    private readonly IMapper _mapper;
    private readonly IClubsRepository _clubsRepository;
    private readonly ITagsRepository _tagsRepository;
    private readonly IReviewVoteRepository _reviewVoteRepository;
    private readonly ISavedClubsRepository _savedClubsRepository;
    private readonly IReviewsRepository _reviewsRepository;
    private readonly IUniversityRepository _universityRepository;
    private readonly UserManager<User> _userManager;
    public ClubController(IMapper mapper, IClubsRepository clubsRepository, ITagsRepository tagsRepository, IReviewVoteRepository reviewVoteRepository, ISavedClubsRepository savedClubsRepository, IReviewsRepository reviewsRepository, UserManager<User> userManager, IUniversityRepository universityRepository)
    {
        _mapper = mapper;
        _clubsRepository = clubsRepository;
        _tagsRepository = tagsRepository;
        _reviewVoteRepository = reviewVoteRepository;
        _savedClubsRepository = savedClubsRepository;
        _reviewsRepository = reviewsRepository;
        _userManager = userManager;
        _universityRepository = universityRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetAllClubs()
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        var clubs = await _clubsRepository.GetClubDetails();
        var clubsDTO = _mapper.Map<List<GetClubsDTO>>(clubs);

        HashSet<int> bookmarkedIds = new();
        if (!string.IsNullOrEmpty(user?.Id))
        {
            bookmarkedIds = await _clubsRepository.GetBookmarkedClubIds(user.Id);
            Console.WriteLine("Bookmarked IDs: " + string.Join(", ", bookmarkedIds));
        }

        foreach (var clubDTO in clubsDTO)
        {
            var club = clubs.FirstOrDefault(c => c.Id == clubDTO.Id);
            if (club != null)
            {
                clubDTO.AverageRating = (club.Reviews != null && club.Reviews.Any())
                ? Math.Round(club.Reviews.Average(r => r.OverallRating), 1)
                : 0;
                clubDTO.Tags = (club.Tags != null && club.Tags.Any())
                ? club.Tags.Select(t => t.Name).ToList()
                : new List<string>();
                clubDTO.IsBookmarked = bookmarkedIds.Contains(clubDTO.Id);
            }

        }
        return Ok(clubsDTO);
    }


    [HttpGet("{universitySlug}/clubs/{slug}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(string universitySlug, string slug)
    {
        var university = await _universityRepository.GetBySlugAsync(universitySlug);
        var club = await _clubsRepository.GetIndividualClubDetails(university.Id, slug);

        if (club is null)
            return NotFound();

        var averages = await _clubsRepository.GetCategoryAveragesForClubAsync(club.Id);
        var clubDTO = _mapper.Map<GetClubDTO>(club);

        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        Console.WriteLine("THIS IS THE FIREBASE ID");
        Console.WriteLine(firebaseUid);
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            Console.WriteLine("in null or empty block");
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
            Console.WriteLine("this is the user");
            Console.WriteLine(user.Id);
        }

        if (user != null)
        {
            clubDTO.IsBookmarked = await _savedClubsRepository.IsBookmarked(club.Id, user.Id);
        }
        Console.WriteLine("THE CLUB BOOKMARK STATUS");
        Console.WriteLine(clubDTO.IsBookmarked);

        if (club.Tags != null && club.Tags.Any())
        {
            clubDTO.Tags = club.Tags.Select(t => t.Name).ToList();
        }

        clubDTO.ReviewCount = await _reviewsRepository.GetReviewCountAsync(club.Id);
        clubDTO.RatingDistribution = await _clubsRepository.GetRatingDistributionForClub(club.Id);
        clubDTO.AverageRating = await _clubsRepository.GetAverageRatingForClub(club.Id);
        clubDTO.LeadershipRating = averages.LeadershipRating;
        clubDTO.InclusivityRating = averages.InclusivityRating;
        clubDTO.NetworkingRating = averages.NetworkingRating;
        clubDTO.SkillsDevelopmentRating = averages.SkillsDevelopmentRating;

        return Ok(clubDTO);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(int id)
    {
        var club = await _clubsRepository.GetIndividualClubDetails(id);

        if (club is null)
            return NotFound();

        var averages = await _clubsRepository.GetCategoryAveragesForClubAsync(club.Id);
        var clubDTO = _mapper.Map<GetClubDTO>(club);

        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        Console.WriteLine("THIS IS THE FIREBASE ID");
        Console.WriteLine(firebaseUid);
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            Console.WriteLine("in null or empty block");
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
            Console.WriteLine("this is the user");
            Console.WriteLine(user.Id);
        }

        if (user != null)
        {
            clubDTO.IsBookmarked = await _savedClubsRepository.IsBookmarked(club.Id, user.Id);
        }
        Console.WriteLine("THE CLUB BOOKMARK STATUS");
        Console.WriteLine(clubDTO.IsBookmarked);

        if (club.Tags != null && club.Tags.Any())
        {
            clubDTO.Tags = club.Tags.Select(t => t.Name).ToList();
        }

        clubDTO.ReviewCount = await _reviewsRepository.GetReviewCountAsync(club.Id);
        clubDTO.RatingDistribution = await _clubsRepository.GetRatingDistributionForClub(club.Id);
        clubDTO.AverageRating = await _clubsRepository.GetAverageRatingForClub(club.Id);
        clubDTO.LeadershipRating = averages.LeadershipRating;
        clubDTO.InclusivityRating = averages.InclusivityRating;
        clubDTO.NetworkingRating = averages.NetworkingRating;
        clubDTO.SkillsDevelopmentRating = averages.SkillsDevelopmentRating;

        return Ok(clubDTO);
    }

    [HttpGet("{universitySlug}/clubs/{clubSlug}/reviews")]
    public async Task<ActionResult<PagedResult<GetReviewDTO>>> GetReviewsForClub(string universitySlug, string clubSlug, int page = 1, int pageSize = 5)
    {
        var university = await _universityRepository.GetBySlugAsync(universitySlug);
        if (university == null) return NotFound("University not found");
        
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        var club = await _clubsRepository.GetBySlugAsync(clubSlug);
        if (club == null)
        {
            return NotFound();
        }
        var result = await _clubsRepository.GetPaginatedReviewsForClub(club.Id, page, pageSize, user?.Id);
        var reviewDTOs = _mapper.Map<List<GetReviewDTO>>(result.Items);
        foreach (var dto in reviewDTOs)
        {
            var matching = result.UserVotes.FirstOrDefault(v => v.ReviewId == dto.Id);
            dto.CurrentUserVote = matching?.Value ?? 0;
        }

        return Ok(new PagedResult<GetReviewDTO>
        {
            Items = reviewDTOs,
            TotalCount = result.TotalCount,
            PageSize = result.PageSize,
            Page = result.Page
        });
    }


    [HttpGet]
    [Route("paged")]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetPagedClubs(int page = 1, int pageSize = 6, int universityId = 1, string? search = null)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and pageSize must be greater than zero.");
        }
        var clubs = await _clubsRepository.GetPagedClubsAsync(page, pageSize, universityId, search);
        var totalCount = await _clubsRepository.GetTotalClubCountAsync(universityId, search);
        var clubDTOs = _mapper.Map<List<GetClubsDTO>>(clubs);
        var result = new
        {
            data = clubDTOs,
            total = totalCount
        };
        return Ok(result);
    }
    [HttpGet("recommended")]
    [Authorize]
    public async Task<IActionResult> GetRecommendedClubs()
    {
        var firebaseUid = HttpContext.Items["FirebaseUid"] as string;
        User? user = null;
        if (!string.IsNullOrEmpty(firebaseUid))
        {
            user = await _userManager.Users.Include(u => u.Tags).Include(u => u.SavedClubs).FirstOrDefaultAsync(u => u.FireBaseUid == firebaseUid);
        }
        if (user == null) return Ok(new List<GetRecommendedClubsDTO>());
        var recommended = await _clubsRepository.GetRecommendedClubsAsync(user.Id, user.Tags.ToList(), user.SavedClubs.ToList(), user.UniversityId);
        var recommendedDTO = _mapper.Map<List<GetRecommendedClubsDTO>>(recommended);
        foreach (var r in recommendedDTO)
        {
            Console.WriteLine(r.Name);
        }
        return Ok(recommendedDTO);
    }

    [HttpGet("popular-clubs")]
    public async Task<IActionResult> GetPopularClubs()
    {
        var popularClubs = await _clubsRepository.GetPopularClubsAsync();
        var result = _mapper.Map<List<GetClubsDTO>>(popularClubs);
        return Ok(result);
    }
}