using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
using RentCarz.Server.Models;

namespace RentCarz.Server.Data
{

	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


		public DbSet<Member> Members { get; set; }
		public DbSet<Admin> Admins { get; set; }
		public DbSet<CarType> CarTypes { get; set; }
		public DbSet<Car> Cars { get; set; }
		public DbSet<Reservation> Reservations { get; set; }
		public DbSet<Payment> Payments { get; set; }
		public DbSet<Review> Reviews { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Reservation>()
				.Property(r => r.Status)
				.HasConversion<string>();

			modelBuilder.Entity<Reservation>()
				.HasOne(r => r.Payment)
				.WithOne(p => p.Reservation)
				.HasForeignKey<Payment>(p => p.ReservationId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Member>()
				.HasOne(m => m.Review)
				.WithOne(r => r.Member)
				.HasForeignKey<Review>(r => r.MemberId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Car>()
				.HasOne(c => c.CarType)
				.WithMany(ct => ct.Cars)
				.HasForeignKey(c => c.CarTypeId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Car>()
				.HasOne(c => c.Admin)
				.WithMany(a => a.Cars)
				.HasForeignKey(c => c.AdminId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Reservation>()
				.HasOne(r => r.Member)
				.WithMany(m => m.Reservations)
				.HasForeignKey(r => r.MemberId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Reservation>()
				.HasOne(r => r.Car)
				.WithMany(c => c.Reservations)
				.HasForeignKey(r => r.CarId)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}

}