using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController(IGenericRepository<Listing> genericRepository, IListingRepository listingRepository) : ControllerBase
    {
        private readonly IListingRepository _listingRepository = listingRepository;
        private readonly IGenericRepository<Listing> _genericRepository = genericRepository;

        [HttpGet("average-price-per-neighbourhood")]
        public IActionResult GetAveragePricePerNeighbourhood()
        {
            var result = _genericRepository.GetQueryableAsync()
                .Where(l => l.Price.HasValue)
                .GroupBy(l => l.Neighbourhood)
                .Select(g => new
                {
                    Neighbourhood = g.Key,
                    AveragePrice = g.Average(l => l.Price!.Value)
                })
                .OrderByDescending(x => x.AveragePrice)
                .ToList();

            return Ok(result);
        }

        [HttpGet("active-listings-per-neighbourhood")]
        public IActionResult GetActiveListingsPerNeighbourhood()
        {
            var result = _genericRepository.GetQueryableAsync()
                .Where(l => l.Availability365 > 0)
                .GroupBy(l => l.Neighbourhood)
                .Select(g => new
                {
                    Neighbourhood = g.Key,
                    ActiveCount = g.Count()
                })
                .OrderByDescending(x => x.ActiveCount)
                .ToList();

            return Ok(result);
        }

        [HttpGet("reviews-per-month")]
        public IActionResult GetReviewsPerMonth()
        {
            var result = _genericRepository.GetQueryableAsync()
                .Include(l => l.Reviews)
                .SelectMany(l => l.Reviews)
                .GroupBy(r => new { r.Date.Year, r.Date.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Count = g.Count()
                })
                .OrderBy(x => x.Month)
                .ToList();

            return Ok(result);
        }

        [HttpGet("average-reviews-per-month-per-neighbourhood")]
        public IActionResult GetAverageReviewsPerMonthPerNeighbourhood()
        {
            var result = _genericRepository.GetQueryableAsync()
                .Where(l => l.ReviewsPerMonth.HasValue)
                .GroupBy(l => l.Neighbourhood)
                .Select(g => new
                {
                    Neighbourhood = g.Key,
                    AvgReviewsPerMonth = g.Average(l => l.ReviewsPerMonth!.Value)
                })
                .OrderByDescending(x => x.AvgReviewsPerMonth)
                .ToList();

            return Ok(result);
        }

        [HttpGet("room-types")]
        public IActionResult GetRoomTypeDistribution()
        {
            var result = _genericRepository.GetQueryableAsync()
                .GroupBy(l => l.RoomType)
                .Select(g => new
                {
                    RoomType = g.Key,
                    Count = g.Count()
                })
                .ToList();

            return Ok(result);
        }
    }
}
