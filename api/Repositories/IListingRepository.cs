using api.Dtos;
using api.Models;

namespace api.Repositories
{
    public interface IListingRepository : IGenericRepository<Listing>
    {
        Task<List<ListingLatLongDto>> GetPagedSummariesAsync(int pageNumber, int pageSize);
        Task<Listing?> GetByIdWithReviewsAsync(long id);
    }
}
