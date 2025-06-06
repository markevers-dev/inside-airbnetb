using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace api.Models;

public partial class Review
{
    public long ListingId { get; set; }

    public long Id { get; set; }

    public DateOnly Date { get; set; }

    public int ReviewerId { get; set; }

    public string ReviewerName { get; set; } = null!;

    public string Comments { get; set; } = null!;

    [JsonIgnore]
    public virtual Listing Listing { get; set; } = null!;
}
