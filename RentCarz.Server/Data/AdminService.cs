using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;

namespace RentCarz.Server.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<Admin> adminLogin(string username, string password)
        {
            //get admin and username
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.AdminUsername == username);
            if (admin == null || admin.AdminPassword != password)
            {
                return null;
            }
            return admin;
        }

        // add car
        public async Task<Car> AddCar(int adminId, Car newCar)
        {


            //assign the admin to the new car
            newCar.AdminId = adminId;

            //add the car to the db
            _context.Cars.Add(newCar);
            await _context.SaveChangesAsync();
            return newCar;
        }

        //update car
        public async Task<Car?> EditCar(int carId, Car updatedCar)
        {
            var existingCar = await _context.Cars.FindAsync(carId);
            if (existingCar == null)
            {
                return null;
            }

            // Update fields
            existingCar.Make = updatedCar.Make;
            existingCar.Model = updatedCar.Model;
            existingCar.Year = updatedCar.Year;
            existingCar.Colour = updatedCar.Colour;
            existingCar.PricePerDay = updatedCar.PricePerDay;
            existingCar.Availability = updatedCar.Availability;
            existingCar.CarTypeId = updatedCar.CarTypeId;

            await _context.SaveChangesAsync();
            return existingCar;
        }

        //delete car from db
        public async Task<bool> DeleteCar(int carId)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                return false;
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
            return true;
        }



        //get all cars added by an admin
        public async Task<List<Car>> GetCarsByAdmin(int adminId)
        {
            return await _context.Cars
                .Where(c => c.AdminId == adminId)
                //include cartype
                .Include(c => c.CarType)
                .ToListAsync();
        }
    }
}
