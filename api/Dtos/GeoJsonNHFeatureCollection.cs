namespace api.Dtos
{
    public class GeoJsonNHFeatureCollection
    {
        public string Type { get; set; } = "FeatureCollection";
        public List<GeoJsonNHFeature> Features { get; set; } = [];
    }
}
