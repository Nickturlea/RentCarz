using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;
using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Globalization;

namespace RentCarz.Server.Controllers
{
    [ApiController]
    [Route("api/reservation")]
    public class ReservationController : ControllerBase
    {
        private readonly ReservationService _reservationService;
        private readonly AppDbContext _context;

        public ReservationController(ReservationService reservationService, AppDbContext context)
        {
            _reservationService = reservationService;
            _context = context;
        }

        // GET: api/reservation/carById/id
        [HttpGet("carById/{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var cars = await _reservationService.getCarById(id);
            return Ok(cars);
        }

        // GET: api/reservation/cartById/id
        [HttpGet("cartById/{id}")]
        public async Task<IActionResult> GetCartById(int id)
        {
            var res = await _reservationService.getCartById(id);
            return Ok(res);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] Reservation data)
        {
            var reservation = await _reservationService.Checkout(data.ReservationId, data.MemberId, data.CarId, data.StartDate, data.EndDate);

            if (reservation == null)
            {
                return BadRequest(new { message = "Reservation null." });
            }

            return Ok(reservation);
        }

        [HttpPost("reserve")]
        public async Task<IActionResult> Reserve([FromBody] Reservation data)
        {
            //getting the times for all dates and setting min and max for checking times
            TimeSpan start = new TimeSpan(06, 0, 0); //6 am
            TimeSpan end = new TimeSpan(22, 0, 0); //10 pm
            TimeSpan startDateTime = data.StartDate.TimeOfDay;
            TimeSpan endDateTime = data.EndDate.TimeOfDay;

            if (data.StartDate > data.EndDate)
            {
                return BadRequest(new { message = "End date must be after start date." });
            }

            if (startDateTime < start || startDateTime > end)
            {
                return BadRequest(new { message = "Start dates time must be between 6am and 10pm" });
            }

            if (endDateTime < start || endDateTime > end)
            {
                return BadRequest(new { message = "End dates time must be between 6am and 10pm" });
            }

            if (data.StartDate == data.EndDate)
            {
                return BadRequest(new { message = "Start and end dates must be different." });
            }

            var reservation = await _reservationService.MakeReservation(data.MemberId, data.CarId, data.StartDate, data.EndDate);
            if (reservation == null)
            {
                return BadRequest(new { message = "Reservation null." });
            }

            return Ok(reservation);
        }

        [HttpPost("payment")]
        public async Task<IActionResult> AddPayment([FromBody] Payment data)
        {


            var paymentMethod = await _reservationService.AddPayment(data.ReservationId, data.CardNumber, data.Month, data.Year, data.CVV, data.FirstName,
            data.LastName, data.Country, data.City, data.ZipCode, data.Email, data.PhoneNumber);

            if (paymentMethod == null)
            {
                return BadRequest(new { message = "Payment null." });
            }

            return Ok(data);
        }

        [HttpPost("checkPay")]
        public async Task<IActionResult> CheckPay([FromBody] Payment data)
        {

            Regex checkCard = new Regex("^[1-9]{16}$");
            Regex checkYear = new Regex("^[0-9]{4}$");
            Regex checkPhone = new Regex("^[0-9]{10}$");
            Regex checkZip = new Regex("[A-Za-z][0-9]+[A-Za-z][0-9]+[A-Za-z][0-9]+");

            var year = DateTime.Now.ToString("yyyy");
            var month = DateTime.Now.ToString("MM");


            if (
                string.IsNullOrWhiteSpace(data.CardNumber.ToString()) ||
                string.IsNullOrWhiteSpace(data.Month.ToString()) ||
                string.IsNullOrWhiteSpace(data.Year.ToString()) ||
                string.IsNullOrWhiteSpace(data.CVV.ToString()) ||
                string.IsNullOrWhiteSpace(data.FirstName) ||
                string.IsNullOrWhiteSpace(data.LastName) ||
                string.IsNullOrWhiteSpace(data.Email) ||
                string.IsNullOrWhiteSpace(data.City) ||
                string.IsNullOrWhiteSpace(data.Country) ||
                string.IsNullOrWhiteSpace(data.ZipCode) ||
                string.IsNullOrWhiteSpace(data.PhoneNumber)
                )
            {
                return BadRequest(new { message = "All fields are required for payment." });
            }

            if(!IsValidEmail(data.Email)){
                return BadRequest(new { message = "Invalid email." });
            }

            if(data.Month<1||data.Month>12){
                return BadRequest(new { message = "Month invalid." });
            }

            if(!checkYear.IsMatch(data.Year.ToString())){
                return BadRequest(new { message = "Year invalid. Make sure to have as YYYY" });
            }

            if(data.Year<int.Parse(year) || (data.Year == int.Parse(year) && data.Month <= int.Parse(month))){
                
                return BadRequest(new { message = "Card is expired" });
            }

            if(!checkPhone.IsMatch(data.PhoneNumber)){
                return BadRequest(new { message = "Phone number should be 10 digits long without spaces, dashes or brackets." });
            }

            if(!checkZip.IsMatch(data.ZipCode)){
                return BadRequest(new { message = "Zip code invalid. Format without spaces in format A1A1A1" });
            }

            if(!checkCard.IsMatch(data.CardNumber)){
                return BadRequest(new { message = "Card number should be 16 digits long." });
            }

            return Ok(data);
        }

        [HttpPost("deleteReservation")]
        public async Task<IActionResult> Delete([FromBody] int id)
        {
            var reservation = await _reservationService.DeleteReservation(id);
            return Ok(reservation);
        }


        //retreived from https://learn.microsoft.com/en-us/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    string domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
            catch (ArgumentException e)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

    }
}
