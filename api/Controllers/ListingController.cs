using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingController(IGenericRepository<Listing> listingRepository) : ControllerBase
    {
        private readonly IGenericRepository<Listing> _listingRepository = listingRepository;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<Listing> listings = await _listingRepository.GetAllAsync();
            return Ok(listings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            Listing listing = await _listingRepository.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            return Ok(listing);
        }
    }
}
