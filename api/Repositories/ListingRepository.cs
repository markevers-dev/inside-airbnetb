using api.Dtos;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class ListingRepository(InsideAirbnetbDbContext context) : GenericRepository<Listing>(context), IListingRepository
    {
        private readonly InsideAirbnetbDbContext _context = context;

        public async Task<List<ListingLatLongDto>> GetPagedSummariesAsync(int pageNumber, int pageSize)
        {
            var listings = await _context.Listings//.AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new ListingLatLongDto
                {
                    Id = l.Id,
                    Latitude = l.Latitude,
                    Longitude = l.Longitude
                })
                .ToListAsync();
            return listings;
        }

        public async Task<Listing?> GetByIdWithReviewsAsync(long id)
        {
            return await _context.Listings
                .Include(l => l.Reviews)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}
