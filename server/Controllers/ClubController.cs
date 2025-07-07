using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase {
    
    private readonly IMapper _mapper;
    private readonly IClubsRepository _clubsRepository;
    public ClubController(IMapper mapper, IClubsRepository clubsRepository)
    { 
        _mapper = mapper;
        _clubsRepository = clubsRepository;  
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetAllClubs(){
        var clubs = await _clubsRepository.GetClubDetails();
        var clubsDTO = _mapper.Map<List<GetClubsDTO>>(clubs);
        foreach (var clubDTO in clubsDTO)
        {
            var club = clubs.FirstOrDefault(c => c.Id == clubDTO.Id);
            if (club != null && club.Reviews != null && club.Reviews.Any())
            {
                clubDTO.AverageRating = Math.Round(club.Reviews.Average(r => r.OverallRating), 1);
            }
            else
            {
                clubDTO.AverageRating = 0;
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
        clubDTO.RatingDistribution = RatingDistributionService.Calculate(club.Reviews);
        clubDTO.AverageRating = club.Reviews.Count != 0 ? Math.Round(club.Reviews.Average(r => r.OverallRating), 1) : 0;

        return Ok(clubDTO);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO){

        var club = _mapper.Map<Club>(createClubDTO);

        await _clubsRepository.AddAsync(club);

        return CreatedAtAction("GetClub", new {id = club.Id}, club);
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
    
    [HttpGet("clubs/filter-multiple")]
    public async Task<IActionResult> GetClubsByTags([FromQuery] List<string> tags)
    {
        var clubs = await _clubsRepository.GetClubsByFilters(tags);
        return Ok(clubs);
    }
    private async Task<bool> ClubExists(int id)
    {

        return await _clubsRepository.Exists(id);
    }
}