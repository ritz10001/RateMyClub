using RateMyCollegeClub.Models;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Data;

using Microsoft.EntityFrameworkCore;

namespace RateMyCollegeClub.Repository;

public class UniversityRepository : GenericRepository<University>, IUniversityRepository
{
    private readonly CollegeClubsDbContext _context;

    public UniversityRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<University>> GetUniversityDetails()
    {
        return await _context.Universities
            .Include(u => u.Clubs)
            .ToListAsync();
    }
    public async Task<University> GetIndividualUniversityDetails(int id)
    {
        return await _context.Universities
            .Include(u => u.Clubs).ThenInclude(c => c.Category)
            .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}
