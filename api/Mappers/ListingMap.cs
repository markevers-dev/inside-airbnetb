using CsvHelper.Configuration;
using api.Models;

namespace api.Mappers
{
    public class ListingMap : ClassMap<Listing>
    {
        public ListingMap()
        {
            Map(m => m.Id).Name("id");
            Map(m => m.Name).Name("name").Optional();
            Map(m => m.HostId).Name("host_id").Optional();
            Map(m => m.HostName).Name("host_name").Optional();
            Map(m => m.NeighbourhoodGroup).Name("neighbourhood_group").Optional();
            Map(m => m.Neighbourhood).Name("neighbourhood").Optional();
            Map(m => m.Latitude).Name("latitude").Optional();
            Map(m => m.Longitude).Name("longitude").Optional();
            Map(m => m.RoomType).Name("room_type").Optional();
            Map(m => m.Price).Name("price").Optional();
            Map(m => m.MinimumNights).Name("minimum_nights").Optional();
            Map(m => m.NumberOfReviews).Name("number_of_reviews").Optional();
            Map(m => m.LastReview).Name("last_review").TypeConverterOption.Format("yyyy-MM-dd").Optional();
            Map(m => m.ReviewsPerMonth).Name("reviews_per_month").Convert(row =>
            {
                var val = row.Row.GetField("reviews_per_month");
                return decimal.TryParse(val, out var result) ? result : null;
            }).Optional();
            Map(m => m.CalculatedHostListingsCount).Name("calculated_host_listings_count").Optional();
            Map(m => m.Availability365).Name("availability_365").Optional();
            Map(m => m.NumberOfReviewsLtm).Name("number_of_reviews_ltm").Optional();
            Map(m => m.License).Name("license").Optional();
        }
    }
}
