using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class UniversityRequestsRepository : GenericRepository<UniversityRequest>, IUniversityRequestsRepository
{
    private readonly CollegeClubsDbContext _context;
    public UniversityRequestsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<UniversityRequest>> GetUniversityRequestsInformation()
    {
        return await _context.UniversityRequests
        .Include(q => q.User)
        .ToListAsync();
    }

    public async Task<List<UniversityRequest>> GetUniversityRequestByUser(string userId)
    {
        return await _context.UniversityRequests
        .Where(q => q.UserId == userId)
        .ToListAsync();
    }
}