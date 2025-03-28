using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;

public class CarService
{
    private readonly AppDbContext _context;

    public CarService(AppDbContext context)
    {
        _context = context;
    }

    // Get all available cars
    public async Task<List<Car>> GetAvailableCars()
    {
        return await _context.Cars
            .Where(c => c.Availability == true)
            .ToListAsync();
    }

    // Get all cars
    public async Task<List<Car>> GetAllCars()
    {
        return await _context.Cars.ToListAsync();
    }


    /*temp until reservation service works
    // Get one car
    public async Task<Car> GetCarByID(int id){
        var car = await _context.Cars.FindAsync(1);
        if(car == null){
            throw new Exception("Car not found or unavailable.");
        }
        return car;
    }*/

    public async Task<List<Car>> getCarById(int id)
    {
        return await _context.Cars
            .Where(c => c.Availability == true && c.CarId == id)
            .ToListAsync();
    }
}
