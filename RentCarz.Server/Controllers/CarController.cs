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


    /*this is temp until reservation controller/service is working
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
        var cars = await _carService.getCarById(id);
        return Ok(cars);
    }


}

