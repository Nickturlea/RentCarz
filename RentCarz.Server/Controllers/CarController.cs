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

    // GET: api/cars/all-cars
    [HttpGet("all-cars")]
    public async Task<IActionResult> GetAllCars()
    {
        var cars = await _carService.GetAllCars();
        return Ok(cars);
    }
}

