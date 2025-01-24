using AutoMapper;
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
        var countriesDTO = _mapper.Map<List<GetClubsDTO>>(clubs);
        return Ok(countriesDTO);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(int id){
        var club = await _clubsRepository.GetIndividualClubDetails(id);

        if(club is null){
            return NotFound();
        }

        var countryDTO = _mapper.Map<GetClubDTO>(club);

        return Ok(countryDTO);
    }

    [HttpPost]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO){

        var club = _mapper.Map<Club>(createClubDTO);

        await _clubsRepository.AddAsync(club);

        return CreatedAtAction("GetClub", new {Id = club.Id}, club);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClub(int id){
        var club = _clubsRepository.GetAsync(id);

        if(club is null){
            return NotFound();
        }

        await _clubsRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClub(int id, UpdateClubDTO updateClubDTO){
        // if(id != updateClubDTO.Id){
        //     return BadRequest("Id's don't match!");
        // }
        
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
    private async Task<bool> ClubExists(int id){

        return await _clubsRepository.Exists(id);
    }
}