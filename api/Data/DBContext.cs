using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DBContext(DbContextOptions<DBContext> options) : DbContext(options)
    {
        public DbSet<Listing> Listings { get; set; }
    }
}
