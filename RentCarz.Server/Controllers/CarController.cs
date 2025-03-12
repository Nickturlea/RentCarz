using Microsoft.AspNetCore.Mvc;

[Route("api/cars")]
[ApiController]
public class CarController : ControllerBase
{
    private readonly CarService _carService;

    public CarController(CarService carService)
    {
        _carService = carService;
    }

    // GET: api/cars/available-cars
    [HttpGet("available-cars")]
    public async Task<IActionResult> GetAvailableCars()
    {
        var cars = await _carService.GetAvailableCars();
        return Ok(cars);
    }

    // POST: api/cars/reserve
    [HttpPost("reserve")]
    public async Task<IActionResult> MakeReservation([FromBody] ReservationRequest request)
    {
        try
        {
            var reservation = await _carService.MakeReservation(request.MemberId, request.CarId, request.StartDate, request.EndDate);
            return Ok(reservation);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

// DTO for reservation request
public class ReservationRequest
{
    public int MemberId { get; set; }
    public int CarId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
