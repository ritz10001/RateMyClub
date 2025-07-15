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

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase {
    
    private readonly IMapper _mapper;
    private readonly IClubsRepository _clubsRepository;
    private readonly ITagsRepository  _tagsRepository;
    private readonly IReviewVoteRepository _reviewVoteRepository;
    public ClubController(IMapper mapper, IClubsRepository clubsRepository, ITagsRepository tagsRepository, IReviewVoteRepository reviewVoteRepository)
    {
        _mapper = mapper;
        _clubsRepository = clubsRepository;
        _tagsRepository = tagsRepository;
        _reviewVoteRepository = reviewVoteRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetAllClubs()
    {
        var clubs = await _clubsRepository.GetClubDetails();
        var clubsDTO = _mapper.Map<List<GetClubsDTO>>(clubs);
        foreach (var clubDTO in clubsDTO)
        {
            var club = clubs.FirstOrDefault(c => c.Id == clubDTO.Id);
            if (club != null)
            {
                if (club.Reviews != null && club.Reviews.Any())
                {
                    clubDTO.AverageRating = Math.Round(club.Reviews.Average(r => r.OverallRating), 1);
                }
                else
                {
                    clubDTO.AverageRating = 0;
                }
                if (club.Tags != null && club.Tags.Any())
                {
                    clubDTO.Tags = club.Tags.Select(t => t.Name).ToList();
                }
                else
                {
                    clubDTO.Tags = new List<string>();
                }
            }

        }
        return Ok(clubsDTO);
    }
    

    [HttpGet("{id}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(int id){
        var club = await _clubsRepository.GetIndividualClubDetails(id);
        
        if(club is null){
            return NotFound();
        }

        var clubDTO = _mapper.Map<GetClubDTO>(club);
        if (club.Tags != null && club.Tags.Any())
        {
            clubDTO.Tags = club.Tags.Select(t => t.Name).ToList();
        }
        clubDTO.RatingDistribution = RatingDistributionService.Calculate(club.Reviews);
        clubDTO.AverageRating = club.Reviews.Count != 0 ? Math.Round(club.Reviews.Average(r => r.OverallRating), 1) : 0;

        var userId = GetUserId();

        if (!string.IsNullOrEmpty(userId) && club.Reviews.Any())
        {
            var reviewIds = club.Reviews.Select(r => r.Id).ToList();
            
            var userVotes = await _reviewVoteRepository.GetVotesByUserForReviewsAsync(userId, reviewIds);

            // Attach vote to each review DTO
            foreach (var review in clubDTO.Reviews)
            {
                var vote = userVotes.FirstOrDefault(v => v.ReviewId == review.Id);
                review.CurrentUserVote = vote?.Value ?? 0; // or null if you prefer
            }
        }

        return Ok(clubDTO);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO)
    {

        var club = _mapper.Map<Club>(createClubDTO);
        if (createClubDTO.TagIds != null && createClubDTO.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(createClubDTO.TagIds);
            club.Tags = tags;
        }
        await _clubsRepository.AddAsync(club);

        // return CreatedAtAction("GetClub", new {id = club.Id}, club);
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteClub(int id){
        var club = _clubsRepository.GetAsync(id);

        if(club is null){
            return NotFound();
        }

        await _clubsRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateClub(int id, UpdateClubDTO updateClubDTO){
        
        var club = await _clubsRepository.GetAsync(id);
        
        if(club is null){
            return NotFound();
        }

        if (updateClubDTO.TagIds != null && updateClubDTO.TagIds.Any())
        {
            var tags = await _tagsRepository.GetTagsByIdsAsync(updateClubDTO.TagIds);
            club.Tags = tags;
        }

        _mapper.Map(updateClubDTO, club);

        try{
            await _clubsRepository.UpdateAsync(club);
        }
        catch(DbUpdateConcurrencyException){
            if(!await ClubExists(id)){
                return NotFound();
            }
            else{
                throw;
            }
        }
        return NoContent();

    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> PatchClub(int id, [FromBody] PatchClubDTO patchClubDTO)
    {
        var club = await _clubsRepository.GetAsync(id);
        if (club is null) return NotFound();
        if (patchClubDTO.Name != null) club.Name = patchClubDTO.Name;
        if (patchClubDTO.Description != null) club.Description = patchClubDTO.Description;
        if (patchClubDTO.ClubLocation != null) club.ClubLocation = patchClubDTO.ClubLocation;
        if (patchClubDTO.IsActive.HasValue) club.IsActive = patchClubDTO.IsActive.Value;
        if (patchClubDTO.CategoryId.HasValue) club.CategoryId = patchClubDTO.CategoryId.Value;
        if (patchClubDTO.LogoUrl != null) club.LogoUrl = patchClubDTO.LogoUrl;
        if (patchClubDTO.TagIds != null)
        {
            // Clear old tags and add new ones, or whatever your tag logic is
            club.Tags.Clear();
            foreach (var tagId in patchClubDTO.TagIds)
            {
                var tag = await _tagsRepository.GetAsync(tagId);
                if (tag == null)
                {
                    return BadRequest($"Tag with ID {tagId} not found.");
                }
                club.Tags.Add(tag);
            }
        }
        await _clubsRepository.SaveChangesAsync();
        return NoContent();
    }

    // [HttpGet("clubs/filter-multiple")]
    // public async Task<IActionResult> GetClubsByTags([FromQuery] List<string> tags)
    // {
    //     var clubs = await _clubsRepository.GetClubsByFilters(tags);
    //     return Ok(clubs);
    // }

    private string GetUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value ?? string.Empty;
    }
    private async Task<bool> ClubExists(int id)
    {

        return await _clubsRepository.Exists(id);
    }
}