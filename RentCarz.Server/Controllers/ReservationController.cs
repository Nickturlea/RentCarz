using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;
using System;
using System.Text;

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


        /* issues parsing as car instead of list of cars
        // GET: api/reservation/carById/id
        [HttpGet("carById/{id}")]
        public async Task<IActionResult> getCarByID(int id)
        {
            var car = await _carService.GetCarByID(id);
            return Ok(car);
        }*/


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

            if(paymentMethod == null){
                return BadRequest(new { message = "Payment null." });
            }

            return Ok(data);
        }

        [HttpPost("deleteReservation")]
        public async Task<IActionResult> Delete([FromBody] int id)
        {

            var reservation = await _reservationService.DeleteReservation(id);

            return Ok(reservation);
        }

    }

}