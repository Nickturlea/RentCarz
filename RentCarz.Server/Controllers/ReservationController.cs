using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;


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


        // GET: api/cars/available-cars
        [HttpGet("carById/{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var cars = await _reservationService.getCarById(id);
            return Ok(cars);
        }

        [HttpPost("reserve")]
        public async Task<IActionResult> Reserve([FromBody] Reservation data )
        {

            var reservation = await _reservationService.MakeReservation(data.MemberId, data.CarId, data.StartDate, data.EndDate);

            if(reservation == null){
                return BadRequest(new { message = "Reservation null." });
            }

            return Ok(reservation);
        }

    }

}