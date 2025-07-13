using RateMyCollegeClub.Models;

namespace RateMyCollegeClub.Interfaces;

public interface ITagsRepository : IGenericRepository<Tag>
{
    Task<List<Tag>> GetTagsByIdsAsync(List<int> ids);
}