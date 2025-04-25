using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Review
{
    public long ListingId { get; set; }

    public DateOnly Date { get; set; }

    public virtual Listing Listing { get; set; } = null!;
}
