using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace RentCarz.Server.Models
{

	public class RefreshTokenRequest
	{
		public int MemberId { get; set; }
		public string Token { get; set; }
	}

}