using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class ListingRepository(InsideAirbnetbDbContext context) : GenericRepository<Listing>(context), IListingRepository
    {
        private readonly InsideAirbnetbDbContext _context = context;

        public async Task<Listing?> GetByIdWithReviewsAsync(long id)
        {
            return await _context.Listings
                .Include(l => l.Reviews)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}
