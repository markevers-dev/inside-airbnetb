using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace api.Redis
{
    public class RedisCacheService(IDistributedCache cache)
    {
        private readonly IDistributedCache _cache = cache;

        public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
        {
            string? cachedData = await _cache.GetStringAsync(key, cancellationToken);

            if (string.IsNullOrEmpty(cachedData)) return default;

            T? t = JsonSerializer.Deserialize<T>(cachedData);
            return t;
        }

        public async Task SetAsync<T>(string key, T data, CancellationToken cancellationToken = default)
        {
            var jsonData = JsonSerializer.Serialize(data);
            await _cache.SetStringAsync(key, jsonData, cancellationToken);
        }
    }
}
