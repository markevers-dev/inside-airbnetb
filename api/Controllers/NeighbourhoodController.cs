using Microsoft.AspNetCore.Mvc;
using api.Dtos;
using System.Text.Json;
using api.Models;
using api.Repositories;

namespace api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class NeighbourhoodController(IWebHostEnvironment env, IGenericRepository<Neighbourhood> genericRepository) : ControllerBase
    {
        private readonly string _geoJsonPath = Path.Combine(env.ContentRootPath, "Data", "neighbourhoods.geojson");
        private readonly IGenericRepository<Neighbourhood> _genericRepository = genericRepository;

        [HttpGet]
        public async Task<IActionResult> GetAllNeighbourhoods()
        {
            List<Neighbourhood> neighbourhoods = await _genericRepository.GetAllAsync();
            return Ok(neighbourhoods);
        }

        [HttpGet("{name}")]
        public IActionResult GetNeighbourhoodGeoJson(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Neighbourhood name is required.");

            if (!System.IO.File.Exists(_geoJsonPath))
                return NotFound("GeoJSON file not found.");

            try
            {
                string json = System.IO.File.ReadAllText(_geoJsonPath);
                GeoJsonNHFeatureCollection? allFeatures = JsonSerializer.Deserialize<GeoJsonNHFeatureCollection>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (allFeatures is null || allFeatures.Features == null)
                    return StatusCode(500, "Invalid GeoJSON structure.");

                GeoJsonNHFeature filtered = allFeatures.Features
                    .FirstOrDefault(f =>
                        string.Equals(f.Properties["neighbourhood"].ToString(), name, StringComparison.OrdinalIgnoreCase));

                if (filtered == null)
                    return NotFound($"Neighbourhood '{name}' not found in GeoJSON data.");

                return Ok(filtered);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing GeoJSON: {ex.Message}");
            }
        }
    }
}
