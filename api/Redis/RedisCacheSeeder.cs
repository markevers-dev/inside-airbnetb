using api.Models;
using api.Repositories;

namespace api.Redis
{
    public class RedisCacheSeeder(
            IGenericRepository<Listing> listingRepository,
            IGenericRepository<Review> reviewRepository,
            IGenericRepository<Neighbourhood> neighbourhoodRepository,
            RedisCacheService cacheService)
    {
        private readonly IGenericRepository<Listing> _listingRepository = listingRepository;
        private readonly IGenericRepository<Review> _reviewRepository = reviewRepository;
        private readonly IGenericRepository<Neighbourhood> _neighbourhoodRepository = neighbourhoodRepository;
        private readonly RedisCacheService _cacheService = cacheService;

        public async Task SeedAsync()
        {
            Console.WriteLine("Seeding Redis cache...");

            List<Listing> listings = await _listingRepository.GetAllAsync();
            List<Review> reviews = await _reviewRepository.GetAllAsync();
            List<Neighbourhood> neighbourhoods = await _neighbourhoodRepository.GetAllAsync();

            foreach (var listing in listings)
            {
                string key = $"listing:{listing.Id}";
                await _cacheService.SetAsync(key, listing);
            }
            await _cacheService.SetAsync("listings:all", listings);

            foreach (var review in reviews)
            {
                string key = $"review:{review.Id}";
                await _cacheService.SetAsync(key, review);
            }
            await _cacheService.SetAsync("reviews:all", reviews);

            foreach (var neighbourhood in neighbourhoods)
            {
                string key = $"neighbourhood:{neighbourhood.Neighbourhood1}";
                await _cacheService.SetAsync(key, neighbourhood);
            }
            await _cacheService.SetAsync("neighbourhoods:all", neighbourhoods);
        }
    }
}
