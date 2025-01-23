using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Validations;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase {
    private readonly CollegeClubsDbContext _context;
    public ClubController(CollegeClubsDbContext context)
    {
        _context = context;   
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Club>>> GetAllClubs(){
        return await _context.Clubs.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Club>> GetClub(int id){
        var club = await _context.Clubs.FindAsync(id);

        if(club is null){
            return NotFound();
        }

        return Ok(club);
    }

    [HttpPost]
    public async Task<ActionResult<Club>> CreateClub(Club club){
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
    public async Task<IActionResult> PutClub(int id, Club club){
        if(id != club.Id){
            return BadRequest("Id's don't match!");
        }

        _context.Entry(club).State = EntityState.Modified;

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