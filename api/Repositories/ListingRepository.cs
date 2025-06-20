﻿using api.Dtos;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class ListingRepository : GenericRepository<Listing>, IListingRepository
    {
        private readonly InsideAirbnetbDbContext _context;

        public ListingRepository(InsideAirbnetbDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<(List<ListingLatLongDto> Listings, int TotalCount)> GetPagedSummariesAsync(int? minReviews, string? priceRange, string? neighbourhood, int pageNumber = 1, int pageSize = 50)
        {
            IQueryable<Listing> query = _context.Listings.AsQueryable();

            if (minReviews > 0)
                query = query.Where(l => l.NumberOfReviews >= minReviews.Value);

            if (!string.IsNullOrEmpty(priceRange))
            {
                var parts = priceRange.Split('-');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int minPrice) &&
                    int.TryParse(parts[1], out int maxPrice))
                {
                    query = query.Where(l => l.Price.HasValue && l.Price >= minPrice && l.Price <= maxPrice);
                }
                else if (priceRange == "750+")
                {
                    query = query.Where(l => l.Price.HasValue && l.Price > 750);
                }
            }

            if (!string.IsNullOrWhiteSpace(neighbourhood))
                query = query.Where(l => l.Neighbourhood == neighbourhood);

            int totalCount = await query.CountAsync();

            List<ListingLatLongDto> listings = await query
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new ListingLatLongDto
                {
                    Id = l.Id.ToString(),
                    Latitude = l.Latitude,
                    Longitude = l.Longitude
                })
                .ToListAsync();
            return (listings, totalCount);
        }

        public async Task<Listing?> GetByIdWithReviewsAsync(long id)
        {
            return await _context.Listings
                .AsNoTrackingWithIdentityResolution()
                .Include(l => l.Reviews)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}
