namespace RateMyCollegeClub.Interfaces;

public interface IGenericRepository<T> where T : class
{
    Task<T> GetAsync(int? id);
    Task<List<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<bool> Exists(int id);
    Task<List<T>> GetPagedAsync(int page, int pageSize);
    Task<int> GetCountAsync();
}

