using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.SavedClubs;

namespace RateMyCollegeClub.Repository;

public class SavedClubsRepository : GenericRepository<SavedClub>, ISavedClubsRepository
{
    private readonly CollegeClubsDbContext _context;
    public SavedClubsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<SavedClub>> GetSavedClubDetails(string userId)
    {
        Console.WriteLine($"Looking for UserId: '{userId}'");
    
    // First, let's see all SavedClubs in the database
        var allSavedClubs = await _context.SavedClubs.ToListAsync();
        Console.WriteLine($"Total SavedClubs in database: {allSavedClubs.Count}");
        
        foreach (var club in allSavedClubs)
        {
            Console.WriteLine($"SavedClub Id: {club.Id}, UserId: '{club.UserId}', ClubId: {club.ClubId}");
        }
        
        // Now try the filtered query
        var filteredClubs = await _context.SavedClubs
            .Where(q => q.UserId == userId)
            .ToListAsync();
        
        Console.WriteLine($"Filtered SavedClubs count: {filteredClubs.Count}");
        // Console.WriteLine()
        return await _context.SavedClubs
        .Where(q => q.UserId == userId)
        .Include(q => q.Club)
            .ThenInclude(q => q.Reviews)
        .Include(q => q.Club)
            .ThenInclude(q => q.Category)
        .Include(q => q.Club)
            .ThenInclude(q => q.University)
        .AsNoTracking()
        .ToListAsync();
    }

}