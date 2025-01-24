using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase {
    private readonly CollegeClubsDbContext _context;
    private readonly IMapper _mapper;
    public ClubController(CollegeClubsDbContext context, IMapper mapper)
    {
        _context = context;   
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetClubsDTO>>> GetAllClubs(){
        var clubs = await _context.Clubs.Include(q => q.Category).ToListAsync();
        var countriesDTO = _mapper.Map<List<GetClubsDTO>>(clubs);
        return Ok(countriesDTO);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetClubDTO>> GetClub(int id){
        var club = await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.Reviews)
        .FirstOrDefaultAsync(q => q.Id == id);

        if(club is null){
            return NotFound();
        }

        var countryDTO = _mapper.Map<GetClubDTO>(club);

        return Ok(countryDTO);
    }

    [HttpPost]
    public async Task<ActionResult<CreateClubDTO>> CreateClub(CreateClubDTO createClubDTO){

        var club = _mapper.Map<Club>(createClubDTO);

        _context.Clubs.Add(club);

        await _context.SaveChangesAsync();

        return CreatedAtAction("GetClub", new {Id = club.Id}, club);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClub(int id){
        var club = await _context.Clubs.FindAsync(id);

        if(club is null){
            return NotFound();
        }

        _context.Clubs.Remove(club);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClub(int id, UpdateClubDTO updateClubDTO){
        // if(id != updateClubDTO.Id){
        //     return BadRequest("Id's don't match!");
        // }
        
        var club = await _context.Clubs.FindAsync(id);
        
        if(club is null){
            return NotFound();
        }

        _mapper.Map(updateClubDTO, club);

        try{
            await _context.SaveChangesAsync();
        }
        catch(DbUpdateConcurrencyException){
            if(!ClubExists(id)){
                return NotFound();
            }
            else{
                throw;
            }
        }
        return NoContent();

    }
    private bool ClubExists(int id){

        return _context.Clubs.Any(e => e.Id == id);
    }
}