using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;

namespace RateMyCollegeClub.Repository;

public class ClubsRepository : GenericRepository<Club>, IClubsRepository {
    private readonly CollegeClubsDbContext _context;
    public ClubsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<Club>> GetClubDetails()
    {
        return await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.University)
        .Include(q => q.Reviews)
        .ToListAsync();
    }

    public async Task<Club> GetIndividualClubDetails(int id)
    {
        return await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.University)
        .Include(q => q.Reviews).ThenInclude(r => r.User)
        .FirstOrDefaultAsync(q => q.Id == id);
    }
}