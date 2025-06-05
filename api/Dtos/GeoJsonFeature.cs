namespace api.Dtos
{
    public class GeoJsonFeature
    {
        public string Type { get; set; } = "Feature";
        public Geometry Geometry { get; set; } = default!;
        public Dictionary<string, object?> Properties { get; set; } = new();
    }
}
