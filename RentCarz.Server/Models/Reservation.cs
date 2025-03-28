using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RentCarz.Server.Models
{

    public class Reservation
    {
        [Key]
        public int ReservationId { get; set; }

        [ForeignKey("MemberId")]
        public int MemberId { get; set; }
        /*
        public Member Member { get; set; }*/

        [ForeignKey("CarId")]
        public int CarId { get; set; }
        /*
        public Car Car { get; set; }*/


        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public ReservationStatus Status { get; set; }


        public enum ReservationStatus
        {
            Pending,
            Confirmed,
            Canceled
        }

        /*
        public Payment Payment { get; set; }
        */
    }
}