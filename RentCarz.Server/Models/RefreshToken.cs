using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RentCarz.Server.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }

        //used so when you execute a json it ignored the required value for this
        [JsonIgnore]
        public Member Member { get; set; }
    }

}