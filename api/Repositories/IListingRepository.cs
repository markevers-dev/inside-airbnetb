using api.Models;

namespace api.Repositories
{
    public interface IListingRepository : IGenericRepository<Listing>
    {
        Task<Listing?> GetByIdWithReviewsAsync(long id);
    }
}
