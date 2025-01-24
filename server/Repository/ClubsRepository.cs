using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class ClubsRepository : GenericRepository<Club>, IClubsRepository {
    private readonly CollegeClubsDbContext _context;
    public ClubsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<Club>> GetClubDetails()
    {
        return await _context.Clubs.Include(q => q.Category).ToListAsync();
    }

    public async Task<Club> GetIndividualClubDetails(int id)
    {
        return await _context.Clubs
        .Include(q => q.Category)
        .Include(q => q.Reviews)
        .FirstOrDefaultAsync(q => q.Id == id);
    }
}