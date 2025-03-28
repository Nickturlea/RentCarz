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
		public DbSet<RefreshToken> RefreshTokens { get; set; }


		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{

			modelBuilder.Entity<Admin>().HasData(new Admin
			{
				AdminId = 1,
				AdminUsername = "admin",
				AdminPassword = "pass123"
			});

			modelBuilder.Entity<CarType>().HasData(
				new CarType { CarTypeId = 1, Type = "Sedan" },
				new CarType { CarTypeId = 2, Type = "SUV" },
				new CarType { CarTypeId = 3, Type = "Truck" },
				new CarType { CarTypeId = 4, Type = "Convertible" },
				new CarType { CarTypeId = 5, Type = "Electric" },
				new CarType { CarTypeId = 6, Type = "Coupe" },
				new CarType { CarTypeId = 7, Type = "Hatchback" },
				new CarType { CarTypeId = 8, Type = "Minivan" },
				new CarType { CarTypeId = 9, Type = "Luxury" },
				new CarType { CarTypeId = 10, Type = "Sports Car" }
			);

			modelBuilder.Entity<RefreshToken>()
			   .HasOne(rt => rt.Member)
			   .WithMany(m => m.RefreshTokens)
			   .HasForeignKey(rt => rt.MemberId)
			   .OnDelete(DeleteBehavior.Cascade);

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
				.OnDelete(DeleteBehavior.SetNull)
				.IsRequired(false);

			modelBuilder.Entity<Car>()
				.HasOne(c => c.Admin)
				.WithMany(a => a.Cars)
				.HasForeignKey(c => c.AdminId)
				.OnDelete(DeleteBehavior.SetNull)
				.IsRequired(false);

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