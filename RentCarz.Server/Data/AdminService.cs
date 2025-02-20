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
            //check if the Admin exists
            var admin = await _context.Admins.FindAsync(adminId);
            if (admin == null)
            {
                throw new Exception("Admin not found.");
            }

            // Check if the CarType exists
            var carType = await _context.CarTypes.FindAsync(newCar.CarTypeId);
            if (carType == null)
            {
                throw new Exception("Car type not found.");
            }

            //assign the admin to the new car
            newCar.AdminId = adminId;

            //add the car to the db
            _context.Cars.Add(newCar);
            await _context.SaveChangesAsync();
            return newCar;
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
