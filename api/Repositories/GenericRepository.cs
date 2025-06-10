using api;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly InsideAirbnetbDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(InsideAirbnetbDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IQueryable<T> GetQueryableAsync()
        {
            return _dbSet.AsQueryable<T>();
        }
        public async Task<List<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public async Task<T> GetByIdAsync(long id)
        {
            var entity = await _dbSet.FindAsync(id);
            return entity!;
        }

        public async Task<List<T>> GetPagedAsync(int pageNumber, int pageSize)
        {
            List<T> entities = await _dbSet.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return entities;
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
