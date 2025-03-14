using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;

public class ReservationService
{
    private readonly AppDbContext _context;

    public ReservationService(AppDbContext context)
    {
        _context = context;
    }

    /*issues parsing as car instead of list of cars
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
    

    // Make a reservation
    public async Task<Reservation> MakeReservation(int memberId, int carId, DateTime startDate, DateTime endDate)
    {
        // Check if the car exists and is available
        var car = await _context.Cars.FindAsync(carId);
        if (car == null || !car.Availability)
        {
            throw new Exception("Car not found or unavailable.");
        }

        // Check if the member exists
        var member = await _context.Members.FindAsync(memberId);
        if (member == null)
        {
            throw new Exception("Member not found.");
        }

        // Create the reservation
        var reservation = new Reservation
        {
            MemberId = memberId,
            CarId = carId,
            StartDate = startDate,
            EndDate = endDate,
            Status = 0
        };

        // Save to the database
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return reservation;
    }
}
