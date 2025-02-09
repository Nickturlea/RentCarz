using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RentCarz.Server.Models
{
    public class CarType
    {
        [Key]
        public int CarTypeId { get; set; }

        [Required]
        public string Type { get; set; }

        public List<Car> Cars { get; set; }
    }
}