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

    public async Task<List<Reservation>> getCartById(int id)
    {
        return await _context.Reservations
            .Where(c => c.MemberId == id && c.Status == Reservation.ReservationStatus.Pending)
            .ToListAsync();
    }

    // Checkout reservation
    public async Task<Reservation> Checkout(int ReservationId, int MemberId, int CarId, DateTime StartDate, DateTime EndDate)
    {

        var res = await _context.Reservations.FindAsync(ReservationId);
        res.Status = Reservation.ReservationStatus.Confirmed;
        // Save to the database
        _context.Reservations.Update(res);
        await _context.SaveChangesAsync();

        return res;
    }
    

    // Make a reservation
    public async Task<Reservation> MakeReservation(int MemberId, int CarId, DateTime StartDate, DateTime EndDate)
    {
        // Check if the car exists and is available
        var car = await _context.Cars.FindAsync(CarId);
        if (car == null || !car.Availability)
        {
            throw new Exception("Car not found or unavailable.");
        }

        // Check if the member exists
        var member = await _context.Members.FindAsync(MemberId);
        if (member == null)
        {
            throw new Exception("Member not found.");
        }

        // Create the reservation
        var reservation = new Reservation
        {
            MemberId = MemberId,
            CarId = CarId,
            StartDate = StartDate,
            EndDate = EndDate,
            Status = 0
        };

        //make car unavailable
        car.Availability = false;
        _context.Cars.Update(car);
        await _context.SaveChangesAsync();

        // Save to the database
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return reservation;
    }

    // Add a payment method
    public async Task<Payment> AddPayment(int ReservationId, string CardNumber, int Month, int Year, int CVV, 
    string FirstName, string LastName, string Country, string City, string ZipCode, string Email, string PhoneNumber)
    {
        // Create the reservation
        var paymentMethod = new Payment
        {
            ReservationId = ReservationId,
            CardNumber = CardNumber, 
            Month = Month, 
            Year = Year,
            CVV = CVV, 
            FirstName = FirstName, 
            LastName = LastName, 
            Country = Country, 
            City = City, 
            ZipCode = ZipCode,
            Email = Email,
            PhoneNumber = PhoneNumber
        };

        // Save to the database
        _context.Payments.Add(paymentMethod);
        await _context.SaveChangesAsync();

        return paymentMethod;
    }

    //delete
    public async Task<Reservation> DeleteReservation(int id)
    {
        //get the reservatoin
        var reservation = await _context.Reservations.FindAsync(id);

        //get the car to make it available again
        var car = await _context.Cars.FindAsync(reservation.CarId);
        
        car.Availability = true;

        // Save to the database
        _context.Cars.Update(car);
        await _context.SaveChangesAsync();

        //delete the reservation and save changes
        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return null;
    }
}
