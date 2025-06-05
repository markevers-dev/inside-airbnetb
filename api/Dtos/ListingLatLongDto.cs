namespace api.Dtos
{
    public class ListingLatLongDto
    {
        public long Id { get; set; }
        public string Latitude { get; set; } = null!;
        public string Longitude { get; set; } = null!;
    }
}
