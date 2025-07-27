using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
public class ClubController : ControllerBase {
    
    private readonly IMapper _mapper;
    private readonly IClubsRepository _clubsRepository;
    private readonly ITagsRepository  _tagsRepository;
    private readonly IReviewVoteRepository _reviewVoteRepository;
    private readonly ISavedClubsRepository _savedClubsRepository;
    private readonly IReviewsRepository _reviewsRepository;
    public ClubController(IMapper mapper, IClubsRepository clubsRepository, ITagsRepository tagsRepository, IReviewVoteRepository reviewVoteRepository, ISavedClubsRepository savedClubsRepository, IReviewsRepository reviewsRepository)
    {
        _mapper = mapper;
        _clubsRepository = clubsRepository;
        _tagsRepository = tagsRepository;
        _reviewVoteRepository = reviewVoteRepository;
        _savedClubsRepository = savedClubsRepository;
        _reviewsRepository = reviewsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetAllClubs()
    {
        var userId = GetUserId();
        var clubs = await _clubsRepository.GetClubDetails();
        var clubsDTO = _mapper.Map<List<GetClubsDTO>>(clubs);

        HashSet<int> bookmarkedIds = new();
        if (!string.IsNullOrEmpty(userId))
        {
            bookmarkedIds = await _clubsRepository.GetBookmarkedClubIds(userId);
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
    

    [HttpGet("{id}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(int id){
        var club = await _clubsRepository.GetIndividualClubDetails(id);
        Console.WriteLine($"Fetched club with {club.Reviews?.Count} reviews");
        var userId = GetUserId();
        
        if (club is null) {
            return NotFound();
        }

        var clubDTO = _mapper.Map<GetClubDTO>(club);
        clubDTO.IsBookmarked = await _savedClubsRepository.IsBookmarked(id, userId ?? string.Empty);
        if (club.Tags != null && club.Tags.Any())
        {
            clubDTO.Tags = club.Tags.Select(t => t.Name).ToList();
        }
        clubDTO.RatingDistribution = await _clubsRepository.GetRatingDistributionForClub(id);

        clubDTO.AverageRating = await _clubsRepository.GetAverageRatingForClub(id);

        // if (!string.IsNullOrEmpty(userId) && club.Reviews.Any())
        // {
        //     var reviewIds = club.Reviews.Select(r => r.Id).ToList();
            
        //     var userVotes = await _reviewVoteRepository.GetVotesByUserForReviewsAsync(userId, reviewIds);

        //     // Attach vote to each review DTO
        //     foreach (var review in clubDTO.Reviews)
        //     {
        //         var vote = userVotes.FirstOrDefault(v => v.ReviewId == review.Id);
        //         review.CurrentUserVote = vote?.Value ?? 0; // or null if you prefer
        //     }
        // }

        return Ok(clubDTO);
    }
    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<PagedResult<GetReviewDTO>>> GetReviewsForClub(int id, int page = 1, int pageSize = 5)
    {
        var userId = GetUserId();
        var result = await _clubsRepository.GetPaginatedReviewsForClub(id, page, pageSize, userId);
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
    private string GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value ?? string.Empty;
    }
}