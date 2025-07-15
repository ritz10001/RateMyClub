using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Repository;

public class ClubsRepository : GenericRepository<Club>, IClubsRepository
{
    private readonly CollegeClubsDbContext _context;
    public ClubsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<Club>> GetClubDetails()
    {
        return await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.University)
        .Include(q => q.Reviews)
        .Include(q => q.Tags)
        .ToListAsync();
    }

    public async Task<Club> GetIndividualClubDetails(int id)
    {
        return await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.University)
        .Include(q => q.Reviews).ThenInclude(r => r.User)
        .Include(q => q.Reviews).ThenInclude(r => r.Votes)
        .Include(q => q.Tags)
        .FirstOrDefaultAsync(q => q.Id == id);
    }

    // public async Task<List<Club>> GetClubsByFilters(List<string> tags)
    // {
    //     return await _context.Clubs
    //         .Where(c => tags.All(t => c.Tags.Contains(t))) // All tags must match
    //         .ToListAsync();
    // }
}