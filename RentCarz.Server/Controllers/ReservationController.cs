using Microsoft.AspNetCore.Mvc;

[Route("api/reservation")]
[ApiController]
public class ReservationController : ControllerBase
{
    private readonly ReservationService _reservationService;

    public ReservationController(ReservationService reservationService)
    {
        _reservationService = reservationService;
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
}

