using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Repository;

public class TagsRepository : GenericRepository<Tag>, ITagsRepository
{
    private readonly CollegeClubsDbContext _context;
    public TagsRepository(CollegeClubsDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Tag?> GetAsync(int id)
    {
        return await _context.Tags.FindAsync(id);
    }
    public async Task<List<Tag>> GetTagsByIdsAsync(List<int>? ids)
    {
        var res = await _context.Tags
        .Where(t => ids.Contains(t.Id))
        .ToListAsync();
        return res;
    }
}