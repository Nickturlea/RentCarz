using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RentCarz.Server.Models
{

    public class Member
    {
        [Key]
        public int MemberId { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        [Required]
        public string Username { get; set; }

        public string? Password { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

        public Review? Review { get; set; }
    }

}