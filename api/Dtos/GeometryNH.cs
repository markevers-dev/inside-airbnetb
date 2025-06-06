namespace api.Dtos
{
    public class GeometryNH
    {
        public string Type { get; set; } = null!;
        public List<List<List<List<double>>>> Coordinates { get; set; } = [];
    }
}
