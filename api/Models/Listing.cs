using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Listing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }
        public string? Name { get; set; }
        public int? HostId { get; set; }
        public string? HostName { get; set; }
        public string? NeighbourhoodGroup { get; set; }
        public string? Neighbourhood { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? RoomType { get; set; }
        public int? Price { get; set; }
        public int? MinimumNights { get; set; }
        public int? NumberOfReviews { get; set; }
        public DateTime? LastReview { get; set; }
        [Column(TypeName = "decimal(6, 2)")]
        public decimal? ReviewsPerMonth { get; set; }
        public int? CalculatedHostListingsCount { get; set; }
        public int? Availability365 { get; set; }
        public int? NumberOfReviewsLtm { get; set; }
        public string? License { get; set; }
    }
}
