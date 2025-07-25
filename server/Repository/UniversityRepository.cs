using RateMyCollegeClub.Models;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Data;

using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Models.Universities;

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
            .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
            .ToListAsync();
    }
    public async Task<University> GetIndividualUniversityDetails(int id)
    {
        return await _context.Universities
            .Include(u => u.Clubs).ThenInclude(c => c.Category)
            .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
            .Include(u => u.Clubs).ThenInclude(c => c.Tags)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<List<University>> SearchByNameAsync(string query)
    {
        return await _context.Universities
        .Where(u => u.Name.Contains(query) || u.Location.Contains(query))
        .OrderBy(u => u.Name)
        .Take(10)
        .ToListAsync();
    }
}
