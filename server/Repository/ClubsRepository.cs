using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Utils;



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

    public async Task<HashSet<int>> GetBookmarkedClubIds(string userId)
    {
        return new HashSet<int>(
            await _context.SavedClubs
            .Where(sc => sc.UserId == userId)
            .Select(sc => sc.ClubId)
            .ToListAsync()
        );

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

    public async Task<List<Club>> GetPagedClubsAsync(int page, int pageSize, int universityId, string? search)
    {
        var query = _context.Clubs
        .Where(c => c.UniversityId == universityId)
        .Include(q => q.Category)
        .Include(q => q.University)
        .Include(q => q.Reviews)
        .Include(q => q.Tags)
        .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Name.Contains(search));
        }

        return await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    }

    public async Task<int> GetTotalClubCountAsync(int universityId, string? search)
    {
        var query = _context.Clubs.Where(c => c.UniversityId == universityId);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u => u.Name.Contains(search));
        }

        return await query.CountAsync();
    }

    public async Task<PagedResult<Club>> GetPagedClubsForUniversity(int universityId, int page, int pageSize, string? search)
    {
        var query = _context.Clubs
        .Where(c => c.UniversityId == universityId)
        .AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c => c.Name.Contains(search));
        }

        var total = await query.CountAsync();

        var items = await query
        .OrderBy(c => c.Name)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

        return new PagedResult<Club>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };

    }
}