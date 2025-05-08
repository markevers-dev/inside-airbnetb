namespace api.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetQueryableAsync();
        Task<List<T>> GetAllAsync();
        Task<List<T>> GetPagedAsync(int pageNumber, int pageSize);
        Task<T> GetByIdAsync(long id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}
