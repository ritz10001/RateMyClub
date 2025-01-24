using System.ComponentModel;
using System.Diagnostics;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]

public class ReviewsController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly CollegeClubsDbContext _context;

    public ReviewsController(IMapper mapper, CollegeClubsDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id) {
        var review = await _context.Reviews.FindAsync(id);
        
        if(review is null){
            return NotFound();
        }
        return Ok(review);
    }

    [HttpPost]
    public async Task<ActionResult<CreateReviewDTO>> CreateReview(CreateReviewDTO createReviewDTO) {
        var review = _mapper.Map<Review>(createReviewDTO);
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetReview", new {id = review.Id}, review);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id){
        var review = await _context.Reviews.FindAsync(id);

        if(review is null){
            return NotFound();
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReview(int id, UpdateReviewDTO updateReviewDTO){
        var review = await _context.Reviews.FindAsync(id);

        if(review is null){
            return NotFound();
        }

        _mapper.Map(updateReviewDTO, review);
        
        try{
            await _context.SaveChangesAsync();
        }
        catch(DbUpdateConcurrencyException){
            if(!ReviewExists(id)){
                return NotFound();
            }
            else{
                throw;
            }
        }

        return NoContent();
    }

    private bool ReviewExists(int id){
        return _context.Reviews.Any(r => r.Id == id);
    }

}
