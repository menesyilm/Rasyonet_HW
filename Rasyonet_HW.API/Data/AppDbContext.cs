using Microsoft.EntityFrameworkCore;
using Rasyonet_HW.API.Models;

namespace Rasyonet_HW.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<PriceSnapshot> PriceSnapshots { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Stock>(entity =>
            {                 
                entity.HasKey(s => s.Id);
                entity.HasIndex(s => s.Symbol).IsUnique();
                entity.Property(s => s.Symbol).IsRequired().HasMaxLength(10);
                entity.Property(s => s.CompanyName).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<PriceSnapshot>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.CurrentPrice).HasColumnType("decimal(18,2)");
                entity.Property(p => p.OpenPrice).HasColumnType("decimal(18,2)");
                entity.Property(p => p.HighPrice).HasColumnType("decimal(18,2)");
                entity.Property(p => p.LowPrice).HasColumnType("decimal(18,2)");
                entity.Property(p => p.PreviousClose).HasColumnType("decimal(18,2)");
                entity.Property(p => p.ChangePercent).HasColumnType("decimal(5,2)");
                entity.HasOne(p => p.Stock)
                      .WithMany(s => s.PriceSnapshot)
                      .HasForeignKey(ps => ps.StockId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
