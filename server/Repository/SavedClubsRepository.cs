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

    public async Task<bool> IsBookmarked(int clubId, string userId)
    {
        return await _context.SavedClubs
        .AnyAsync(q => q.ClubId == clubId && q.UserId == userId);
    }

    public async Task<SavedClub?> GetSavedClubById(int clubId, string userId)
    {
        return await _context.SavedClubs
        .FirstOrDefaultAsync(q => q.ClubId == clubId && q.UserId == userId);
    }
    public async Task<List<SavedClub>> GetSavedClubDetails(string userId)
    {
        // Console.WriteLine()
        return await _context.SavedClubs
        .Where(q => q.UserId == userId)
        .Include(q => q.Club)
            .ThenInclude(q => q.Reviews)
        .Include(q => q.Club)
            .ThenInclude(q => q.Category)
        .Include(q => q.Club)
            .ThenInclude(q => q.University)
        .Include(q => q.Club)
            .ThenInclude(q => q.Tags)
        .AsNoTracking()
        .ToListAsync();
    }

}