namespace api.Dtos
{
    public class GeoJsonNHFeature
    {
        public string Type { get; set; } = "Feature";
        public GeometryNH Geometry { get; set; } = new();
        public Dictionary<string, object?> Properties { get; set; } = new();
    }
}
