namespace api.Dtos
{
    public class Geometry
    {
        public string Type { get; set; } = "Point";
        public double[] Coordinates { get; set; } = default!;
    }
}
