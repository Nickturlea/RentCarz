using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentCarz.Server.Models
{
    public class Car
    {
        [Key]
        public int CarId { get; set; }

        [Required]
        public string Make { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public double PricePerDay { get; set; }

        public bool Availability { get; set; } = true;

        [Required]
        public string Colour { get; set; }

        public int? CarTypeId { get; set; }
        [ForeignKey("CarTypeId")]
        public CarType? CarType { get; set; }

        public int? AdminId { get; set; }
        [ForeignKey("AdminId")]
        public Admin? Admin { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}