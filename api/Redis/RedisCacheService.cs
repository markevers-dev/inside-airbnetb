using StackExchange.Redis;
using System.Text.Json;

namespace api.Redis
{
    public class RedisCacheService(IConnectionMultiplexer mux)
    {
        private readonly IDatabase _db = mux.GetDatabase();

        public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
        {
            var bytes = await _db.StringGetAsync(key);

            if (!bytes.HasValue)
                return default;


            return JsonSerializer.Deserialize<T>(bytes!);
        }

        public async Task SetAsync<T>(string key, T data, CancellationToken cancellationToken = default)
        {
            var jsonData = JsonSerializer.Serialize(data);
            await _db.StringSetAsync(key, jsonData);
        }
    }
}
