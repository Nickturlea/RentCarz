using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RentCarz.Server.Models
{

    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        public int ReservationId { get; set; }
        [ForeignKey("ReservationId")]/*
        public Reservation Reservation { get; set; }*/

        [Required]
        public string CardNumber { get; set; }

        [Required]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public int CVV { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string ZipCode { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }

}