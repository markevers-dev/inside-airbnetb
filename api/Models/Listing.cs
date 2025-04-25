using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Listing
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public int HostId { get; set; }

    public string? HostName { get; set; }

    public string? NeighbourhoodGroup { get; set; }

    public string Neighbourhood { get; set; } = null!;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string RoomType { get; set; } = null!;

    public int? Price { get; set; }

    public short MinimumNights { get; set; }

    public short NumberOfReviews { get; set; }

    public DateOnly? LastReview { get; set; }

    public double? ReviewsPerMonth { get; set; }

    public short CalculatedHostListingsCount { get; set; }

    public short Availability365 { get; set; }

    public short NumberOfReviewsLtm { get; set; }

    public string? License { get; set; }
}
