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

    public async Task<University> GetUniversityBasicData(int id)
    {
        return await _context.Universities.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<List<University>> GetUniversityDetails()
    {
        return await _context.Universities
            .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
            .ToListAsync();
    }
    public async Task<University?> GetIndividualUniversityDetails(string slug)
    {
        return await _context.Universities
            .Include(u => u.Clubs).ThenInclude(c => c.Category)
            .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
            .Include(u => u.Clubs).ThenInclude(c => c.Tags)
            .FirstOrDefaultAsync(u => u.Slug == slug);
    }
    public async Task<List<University>> SearchByNameAsync(string query)
    {
        return await _context.Universities
        .Where(u => u.Name.Contains(query) || u.Location.Contains(query) || u.SecondaryName.Contains(query))
        .OrderBy(u => u.Name)
        .Take(10)
        .ToListAsync();
    }

    public async Task<List<University>> GetPagedUniversitiesAsync(int page, int pageSize, string? search = null)
    {
        var query = _context.Universities
        .Include(u => u.Clubs).ThenInclude(c => c.Reviews)
        .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Name.Contains(search) || u.Location.Contains(search) || u.SecondaryName.Contains(search));
        }

        return await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    }
    public async Task<int> GetTotalUniversityCountAsync(string? search = null)
    {
        var query = _context.Universities.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Name.Contains(search));
        }

        return await query.CountAsync();
    }

    public async Task<string> GetUniversityNameByIdAsync(int id)
    {
        var res = await _context.Universities
        .Where(u => id == u.Id)
        .Select(u => u.Name)
        .FirstOrDefaultAsync();

        return res ?? "Other";
    }

    public async Task<List<University>> GetPopularUniversitiesAsync()
    {
        return await _context.Universities
        .Select(u => new
        {
            University = u,
            ReviewCount = u.Clubs.SelectMany(c => c.Reviews).Count()
        })
        .OrderByDescending(x => x.ReviewCount)
        .Take(10)
        .Select(x => x.University) // project back to entity
        .Include(u => u.Clubs)
        .ThenInclude(c => c.Reviews)
        .ToListAsync();
    }

    public async Task<string> GenerateSlug(string name)
    {
        return name.ToLower()
        .Replace(" ", "-")
        .Replace(".", "")
        .Replace(",", "")
        .Replace("'", "")
        .Replace("(", "")
        .Replace(")", "")
        .Replace("&", "and");
    }
    public async Task<University?> GetBySlugAsync(string slug)
    {
        return await _context.Universities.FirstOrDefaultAsync(u => u.Slug == slug);
    }

    public async Task<University?> GetUniversityBySlug(string slug)
    {
        return await _context.Universities.FirstOrDefaultAsync(u => u.Slug == slug);
    }

}
