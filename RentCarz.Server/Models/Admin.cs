using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentCarz.Server.Models  
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        [Required]
        public string AdminUsername { get; set; }

        [Required]
        public string AdminPassword { get; set; }

        public List<Car> Cars { get; set; }
    }
}
