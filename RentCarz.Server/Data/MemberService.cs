using System;
using System.Text;
using RentCarz.Server.Data;
using RentCarz.Server.Models;
using Microsoft.EntityFrameworkCore;



namespace RentCarz.Server.Data
{
    public class MemberService
    {
        private readonly AppDbContext _context;

        public MemberService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Member> RegisterUser(string username, string password, string email, string fullName, string phoneNumber, string address)
        {
            //checks if user already exists
            var existingUser = await _context.Members.FirstOrDefaultAsync(m => m.Username == username);
            if (existingUser != null)
            {
                return null;//which in the controller will display user already exists
            }

            //hash the password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var createdUser = new Member
            {
                Username = username,
                Password = hashedPassword,
                Email = email,
                FullName = fullName,
                PhoneNumber = phoneNumber,
                Address = address
            };

            //add to database
            _context.Members.Add(createdUser);
            await _context.SaveChangesAsync();

            return createdUser;
        }
    }










}