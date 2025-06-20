﻿namespace api.Models;

public partial class Listing
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public int HostId { get; set; }

    public string? HostName { get; set; }

    public string? NeighbourhoodGroup { get; set; }

    public string Neighbourhood { get; set; } = null!;

    public string Latitude { get; set; } = null!;

    public string Longitude { get; set; } = null!;

    public string RoomType { get; set; } = null!;

    public int? Price { get; set; }

    public short MinimumNights { get; set; }

    public short NumberOfReviews { get; set; }

    public DateTime? LastReview { get; set; }

    public double? ReviewsPerMonth { get; set; }

    public byte CalculatedHostListingsCount { get; set; }

    public short Availability365 { get; set; }

    public short NumberOfReviewsLtm { get; set; }

    public string? License { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = [];
}
