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
        private readonly IListingRepository _listingRepository = ListingRepository;
        private readonly int chunkSize = 10000;

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

            int from = (pageNumber - 1) * pageSize;
            int to = from + pageSize;
            int chunkIndex = 0;
            int totalMatched = 0;

            List<Listing> matched = [];

            int? minPrice = null;
            int? maxPrice = null;

            if (!string.IsNullOrWhiteSpace(priceRange))
            {
                var parts = priceRange.Split('-');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int parsedMin) &&
                    int.TryParse(parts[1], out int parsedMax))
                {
                    minPrice = parsedMin;
                    maxPrice = parsedMax;
                }
                else if (priceRange == "750+")
                {
                    minPrice = 750;
                }
            }

            while (matched.Count < to)
            {
                var chunk = await cacheService.GetAsync<List<Listing>>($"listings:{chunkIndex}");
                if (chunk is null || chunk.Count == 0)
                    break;

                foreach (var listing in chunk)
                {
                    if (minReviews.HasValue && listing.NumberOfReviews < minReviews.Value)
                        continue;

                    if (!string.IsNullOrWhiteSpace(neighbourhood) && listing.Neighbourhood != neighbourhood)
                        continue;

                    if (priceRange is not null)
                    {
                        if (!listing.Price.HasValue)
                            continue;

                        if (maxPrice == null)
                        {
                            if (listing.Price <= minPrice)
                                continue;
                        }
                        else
                        {
                            if (listing.Price < minPrice || listing.Price > maxPrice)
                                continue;
                        }
                    }

                    if (totalMatched >= from && matched.Count < pageSize)
                        matched.Add(listing);

                    totalMatched++;

                    if (matched.Count == pageSize)
                        break;
                }

                chunkIndex++;
            }

            if (matched.Count > 0)
            {
                var geoJson = ConvertToGeoJson(matched.Select(l => new ListingLatLongDto
                {
                    Id = l.Id.ToString(),
                    Latitude = l.Latitude,
                    Longitude = l.Longitude
                }).ToList());

                var redisResult = new PagedGeoJsonDto
                {
                    Features = geoJson,
                    TotalCount = totalMatched,
                    TotalPages = (int)Math.Ceiling((double)totalMatched / pageSize)
                };

                return Ok(redisResult);
            }

            var (dbListings, dbCount) = await _listingRepository.GetPagedSummariesAsync(minReviews, priceRange, neighbourhood, pageNumber, pageSize);
            var dbGeoJson = ConvertToGeoJson(dbListings.Select(l => new ListingLatLongDto
            {
                Id = l.Id.ToString(),
                Latitude = l.Latitude,
                Longitude = l.Longitude
            }).ToList());

            var dbResult = new PagedGeoJsonDto
            {
                Features = dbGeoJson,
                TotalCount = dbCount,
                TotalPages = (int)Math.Ceiling((double)dbCount / pageSize)
            };

            return Ok(dbResult);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
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
