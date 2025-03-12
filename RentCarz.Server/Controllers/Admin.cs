using Microsoft.AspNetCore.Mvc;
using RentCarz.Server.Services;
using RentCarz.Server.Models;
using System;
using System.Threading.Tasks;
using System.Text.Json;

namespace RentCarz.Server.Controllers
{
    [ApiController]
    [Route("api/admins")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("adminLogin")]
        public async Task<IActionResult> Login([FromBody] Admin request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.AdminUsername) || string.IsNullOrWhiteSpace(request.AdminPassword))
                {
                    return BadRequest(new { message = "Username and password are required!" });
                }

                // call service
                var admin = await _adminService.adminLogin(request.AdminUsername, request.AdminPassword);
                if (admin == null)
                {
                    return Unauthorized(new { message = "Invalid admin credentials!" });
                }

                return Ok(new { message = "Login successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error logging in: {ex.Message}" });
            }
        }

[HttpPost("addCar")]
public async Task<IActionResult> AddCar([FromBody] Car newCar)
{
    Console.WriteLine($"Received Data: {JsonSerializer.Serialize(newCar)}");

    ModelState.Clear(); // Temporarily disable validation

    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        var addedCar = await _adminService.AddCar(newCar.AdminId, newCar);
        return Ok(addedCar);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}


    }
}
