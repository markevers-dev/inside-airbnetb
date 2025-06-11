using api.Dtos;
using api.Models;
using api.Redis;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingController(IGenericRepository<Listing> GenericRepository, IListingRepository ListingRepository) : ControllerBase
    {
        private readonly IGenericRepository<Listing> _genericRepository = GenericRepository;
        private readonly IListingRepository _listingRepository = ListingRepository;

        [HttpGet]
        public async Task<IActionResult> GetAllPaged(
            [FromServices] RedisCacheService cacheService,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] int? minReviews = 0,
            [FromQuery] string? priceRange = null,
            [FromQuery] string? neighbourhood = null
            )
        {
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and size must be greater than zero.");

            List<Listing>? cachedListings = await cacheService.GetAsync<List<Listing>>("listings:all");
            System.Diagnostics.Debug.WriteLine($"Cached listings count: {cachedListings?.Count ?? 0}");

            if (cachedListings is not null)
            {
                System.Diagnostics.Debug.WriteLine("Using cached listings.");
                IEnumerable<Listing> filtered = cachedListings;

                if (minReviews > 0)
                    filtered = filtered.Where(l => l.NumberOfReviews >= minReviews);

                if (!string.IsNullOrEmpty(priceRange))
                {
                    var parts = priceRange.Split('-');
                    if (parts.Length == 2 &&
                        int.TryParse(parts[0], out int minPrice) &&
                        int.TryParse(parts[1], out int maxPrice))
                    {
                        filtered = filtered.Where(l => l.Price.HasValue && l.Price >= minPrice && l.Price <= maxPrice);
                    }
                    else if (priceRange == "750+")
                    {
                        filtered = filtered.Where(l => l.Price.HasValue && l.Price > 750);
                    }
                }

                if (!string.IsNullOrWhiteSpace(neighbourhood))
                    filtered = filtered.Where(l => l.Neighbourhood == neighbourhood);

                int totalCachedCount = filtered.Count();

                var paged = filtered
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new ListingLatLongDto
                    {
                        Id = l.Id.ToString(),
                        Latitude = l.Latitude,
                        Longitude = l.Longitude
                    })
                    .ToList();

                GeoJsonFeatureCollection cachedGeoJson = ConvertToGeoJson(paged);

                PagedGeoJsonDto cachedResult = new()
                {
                    Features = cachedGeoJson,
                    TotalPages = (int)Math.Ceiling(totalCachedCount / (double)pageSize),
                    TotalCount = totalCachedCount
                };

                return Ok(cachedResult);
            }

            var (listings, totalCount) = await _listingRepository.GetPagedSummariesAsync(minReviews, priceRange, neighbourhood, pageNumber, pageSize);
            GeoJsonFeatureCollection geoJson = ConvertToGeoJson(listings);
            int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            PagedGeoJsonDto result = new()
            {
                Features = geoJson,
                TotalPages = totalPages,
                TotalCount = totalCount
            };

            return Ok(result);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id,
            [FromServices] RedisCacheService cacheService
            )
        {
            if (id <= 0)
                return BadRequest("Invalid listing ID.");
            string cacheKey = $"listing:{id}";
            Listing? cachedListing = await cacheService.GetAsync<Listing>(cacheKey);
            if (cachedListing != null)
            {
                System.Diagnostics.Debug.WriteLine("Using cached listing.");
                return Ok(cachedListing);
            }

            Listing? listing = await _listingRepository.GetByIdWithReviewsAsync(id);
            if (listing == null)
                return NotFound();
            return Ok(listing);
        }

        private static GeoJsonFeatureCollection ConvertToGeoJson(List<ListingLatLongDto> listings)
        {
            GeoJsonFeatureCollection featureCollection = new()
            {
                Features = [.. listings.Select(listing => new GeoJsonFeature
                {
                    Geometry = new Geometry
                    {
                        Type = "Point",
                        Coordinates =
                        [
                            double.Parse(listing.Longitude, CultureInfo.InvariantCulture),
                            double.Parse(listing.Latitude, CultureInfo.InvariantCulture)
                        ]
                    },
                    Properties = new Dictionary<string, object?>
                    {
                        { "id", listing.Id },
                    }
                })]
            };

            return featureCollection;
        }
    }
}
