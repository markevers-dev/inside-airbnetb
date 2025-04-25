namespace api.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetQueryableAsync();
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}
