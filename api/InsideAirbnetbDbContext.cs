using System;
using System.Collections.Generic;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api;

public partial class InsideAirbnetbDbContext : DbContext
{
    public InsideAirbnetbDbContext()
    {
    }

    public InsideAirbnetbDbContext(DbContextOptions<InsideAirbnetbDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Listing> Listings { get; set; }

    public virtual DbSet<Neighbourhood> Neighbourhoods { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Listing>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("listings_pkey");

            entity.ToTable("listings");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Availability365).HasColumnName("availability_365");
            entity.Property(e => e.CalculatedHostListingsCount).HasColumnName("calculated_host_listings_count");
            entity.Property(e => e.HostId).HasColumnName("host_id");
            entity.Property(e => e.HostName)
                .HasMaxLength(50)
                .HasColumnName("host_name");
            entity.Property(e => e.LastReview).HasColumnName("last_review");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.License)
                .HasMaxLength(1)
                .HasColumnName("license");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.MinimumNights).HasColumnName("minimum_nights");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Neighbourhood)
                .HasMaxLength(50)
                .HasColumnName("neighbourhood");
            entity.Property(e => e.NeighbourhoodGroup)
                .HasMaxLength(1)
                .HasColumnName("neighbourhood_group");
            entity.Property(e => e.NumberOfReviews).HasColumnName("number_of_reviews");
            entity.Property(e => e.NumberOfReviewsLtm).HasColumnName("number_of_reviews_ltm");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.ReviewsPerMonth).HasColumnName("reviews_per_month");
            entity.Property(e => e.RoomType)
                .HasMaxLength(50)
                .HasColumnName("room_type");
        });

        modelBuilder.Entity<Neighbourhood>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("neighbourhoods");

            entity.Property(e => e.Neighbourhood1)
                .HasMaxLength(50)
                .HasColumnName("neighbourhood");
            entity.Property(e => e.NeighbourhoodGroup)
                .HasMaxLength(1)
                .HasColumnName("neighbourhood_group");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("reviews");

            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.ListingId).HasColumnName("listing_id");

            entity.HasOne(d => d.Listing).WithMany()
                .HasForeignKey(d => d.ListingId)
                .HasConstraintName("fk_reviews_listing");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
