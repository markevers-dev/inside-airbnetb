using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingController(IGenericRepository<Listing> GenericRepository, IListingRepository ListingRepository) : ControllerBase
    {
        private readonly IGenericRepository<Listing> _genericRepository = GenericRepository;
        private readonly IListingRepository _listingRepository = ListingRepository;

        [HttpGet]
        public async Task<IActionResult> GetAllPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 200)
        {
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and size must be greater than zero.");

            var pagedListings = await _genericRepository.GetPagedAsync(pageNumber, pageSize);
            return Ok(pagedListings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var listing = await _listingRepository.GetByIdWithReviewsAsync(id);
            if (listing == null)
                return NotFound();
            return Ok(listing);
        }
    }
}
