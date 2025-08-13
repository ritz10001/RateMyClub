using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Clubs;
using RateMyCollegeClub.Models.Reviews;
using RateMyCollegeClub.Utils;
using server.Models;



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
        // .Include(q => q.Reviews).ThenInclude(r => r.User)
        // .Include(q => q.Reviews).ThenInclude(r => r.Votes)
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

    public async Task<PaginatedReviewEntityResult> GetPaginatedReviewsForClub(int clubId, int page, int pageSize, string? userId)
    {
        var query = _context.Reviews
        .Where(r => r.ClubId == clubId)
        .OrderByDescending(r => r.CreatedAt)
        .AsQueryable();

        var totalCount = await query.CountAsync();

        var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

        List<ReviewVote> userVotes = new();

        if (!string.IsNullOrEmpty(userId))
        {
            var ids = items.Select(r => r.Id).ToList();
            userVotes = await _context.ReviewVotes
            .Where(v => v.UserId == userId && ids.Contains(v.ReviewId))
            .ToListAsync();
        }

        return new PaginatedReviewEntityResult
        {
            Items = items,
            UserVotes = userVotes,
            TotalCount = totalCount,
            PageSize = pageSize,
            Page = page
        };

    }
    public async Task<Dictionary<int, int>> GetRatingDistributionForClub(int clubId)
    {
        // Query database, group by average rating rounded to int, get counts
        var distributionData = await _context.Reviews
            .Where(r => r.ClubId == clubId)
            .GroupBy(r =>
                (int)Math.Round(
                    (r.LeadershipRating + r.InclusivityRating + r.NetworkingRating + r.SkillsDevelopmentRating) / 4.0
                )
            )
            .Select(g => new { Rating = g.Key, Count = g.Count() })
            .ToListAsync();

        // Initialize dictionary with all ratings from 1 to 5 set to 0
        var distribution = new Dictionary<int, int>
        {
            { 1, 0 },
            { 2, 0 },
            { 3, 0 },
            { 4, 0 },
            { 5, 0 }
        };

        // Fill dictionary with actual counts from query result
        foreach (var entry in distributionData)
        {
            if (entry.Rating >= 1 && entry.Rating <= 5)
            {
                distribution[entry.Rating] = entry.Count;
            }
        }

        return distribution;
    }
    public async Task<decimal> GetAverageRatingForClub(int clubId)
    {
        var avg = await _context.Reviews
            .Where(r => r.ClubId == clubId)
            .AverageAsync(r => (decimal?)r.OverallRating); // decimal? to handle 0-reviews case

        return Math.Round(avg ?? 0, 1);
    }

    public async Task<CategoryAveragesDTO> GetCategoryAveragesForClubAsync(int clubId)
    {
        return await _context.Reviews
            .Where(r => r.ClubId == clubId)
            .GroupBy(r => 1) // Group all reviews for the club
            .Select(g => new CategoryAveragesDTO
            {
                LeadershipRating = (decimal)g.Average(r => r.LeadershipRating),
                InclusivityRating = (decimal)g.Average(r => r.InclusivityRating),
                NetworkingRating = (decimal)g.Average(r => r.NetworkingRating),
                SkillsDevelopmentRating = (decimal)g.Average(r => r.SkillsDevelopmentRating)
            })
            .FirstOrDefaultAsync() ?? new CategoryAveragesDTO();
    }
    public async Task<List<Club>> GetRecommendedClubsAsync(string userId, List<Tag> interests, List<SavedClub> savedClubs, int? schoolId)
    {
        // Extract IDs for quick filtering
        var interestTagIds = interests.Select(t => t.Id).ToList();
        var savedClubIds = savedClubs.Select(sc => sc.ClubId).ToList();
        IQueryable<Club> query = _context.Clubs
        .Include(c => c.University)
        .Include(c => c.Tags)          // Include Tags for mapping Tags property
        .Include(c => c.Reviews)       // Include Reviews for AverageRating and ReviewCount
        .Include(c => c.Category).AsQueryable();
        // Filter by school if provided
        if (schoolId.HasValue)
        {
            query = query.Where(c => c.UniversityId == schoolId.Value);
        }
        // Start with clubs matching user's tags, excluding saved clubs
        query = query.Where(c => !savedClubIds.Contains(c.Id) && c.Tags.Any(t => interestTagIds.Contains(t.Id)));

        var recommendedClubs = await query.Take(10).ToListAsync();
        return recommendedClubs;
    }
    public async Task<List<Club>> GetPopularClubsAsync()
    {
        return await _context.Clubs
        .Include(c => c.Reviews)
        .Include(c => c.University)
        .Include(c => c.Category)
        .OrderByDescending(c => c.Reviews.Count)
        .Take(10)
        .ToListAsync();
    }
}