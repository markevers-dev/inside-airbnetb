using api.Dtos;
using api.Models;

namespace api.Repositories
{
    public interface IListingRepository : IGenericRepository<Listing>
    {
        Task<(List<Listing> Listings, int TotalCount)> GetPagedSummariesAsync(int? minReviews, string? priceRange, string? neighbourhood, int pageNumber = 1, int pageSize = 50);
        Task<Listing?> GetByIdWithReviewsAsync(long id);
    }
}
