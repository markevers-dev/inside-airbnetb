using api.Dtos;
using api.Models;
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
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 50,
            [FromQuery] int? minReviews = 0,
            [FromQuery] string? priceRange = null,
            [FromQuery] string? neighbourhood = null)
        {
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and size must be greater than zero.");

            var(listings, totalCount) = await _listingRepository.GetPagedSummariesAsync(minReviews, priceRange, neighbourhood, pageNumber, pageSize);
            GeoJsonFeatureCollection geoJson = ConvertToGeoJson(listings);
            int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            PagedGeoJsonDto result = new PagedGeoJsonDto
            {
                Features = geoJson,
                TotalPages = totalPages,
                TotalCount = totalCount
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            Listing? listing = await _listingRepository.GetByIdWithReviewsAsync(id);
            if (listing == null)
                return NotFound();
            return Ok(listing);
        }

        private static GeoJsonFeatureCollection ConvertToGeoJson(List<ListingLatLongDto> listings)
        {
            GeoJsonFeatureCollection featureCollection = new GeoJsonFeatureCollection
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
