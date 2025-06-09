namespace api.Dtos
{
    public class PagedGeoJsonDto
    {
        public GeoJsonFeatureCollection Features { get; set; } = new();
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
    }
}
