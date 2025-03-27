using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RentCarz.Server.Models
{

    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        public int MemberId { get; set; }
        [ForeignKey("MemberId")]/*
        public Member Member { get; set; }*/

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;
    }
}