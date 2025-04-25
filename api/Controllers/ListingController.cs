using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingController(IGenericRepository<Listing> GenericRepository) : ControllerBase
    {
        private readonly IGenericRepository<Listing> _genericRepository = GenericRepository;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var listings = await _genericRepository.GetAllAsync();
            return Ok(listings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var listing = await _genericRepository.GetByIdAsync(id);
            if (listing == null)
                return NotFound();
            return Ok(listing);
        }
    }
}
