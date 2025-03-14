using Microsoft.AspNetCore.Mvc;

[Route("api/reservation")]
[ApiController]
public class ReservationController : ControllerBase
{
    private readonly ReservationService _ReservationService;

    public ReservationController(ReservationService reservationService)
    {
        _ReservationService = reservationService;
    }

    // GET: api/reservation/carById/id
    [HttpGet("carById/{id}")]
    public async Task<IActionResult> getCarByID(int id)
    {
        var car = await _ReservationService.GetCarByID(id);
        return Ok(car);
    }
}