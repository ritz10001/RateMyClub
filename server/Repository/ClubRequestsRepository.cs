using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class ClubRequestsRepository : GenericRepository<ClubRequest>, IClubRequestsRepository
{
    private readonly CollegeClubsDbContext _context;
    public ClubRequestsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }
    public async Task<List<ClubRequest>> GetClubRequestsInformation()
    {
        return await _context.ClubRequests
        .Include(r => r.User)
        .Include(r => r.University)
        .Include(r => r.Category)
        .ToListAsync();
    }
}