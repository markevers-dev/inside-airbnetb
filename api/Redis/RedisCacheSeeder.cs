using api.Models;
using api.Repositories;

namespace api.Redis
{
    public class RedisCacheSeeder(
            IGenericRepository<Listing> listingRepository,
            RedisCacheService cacheService)
    {
        private readonly IGenericRepository<Listing> _listingRepository = listingRepository;
        private readonly RedisCacheService _cacheService = cacheService;
        private readonly int chunkSize = 500;

        public async Task SeedAsync()
        {
            int index = 0;
            List<Listing> listings = await _listingRepository.GetAllAsync();

            for (int i = 0; i < listings.Count; i += chunkSize)
            {
                var chunk = listings.Skip(i).Take(chunkSize).ToList();
                await _cacheService.SetAsync($"listings:{index}", chunk);
                index++;
            }
        }
    }
}
