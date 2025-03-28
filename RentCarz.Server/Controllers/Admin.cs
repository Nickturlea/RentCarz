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
            Console.WriteLine(request.AdminUsername);
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

    if (newCar.AdminId == null)
    {
        return BadRequest(new { message = "AdminId is required." });
    }

    try
    {
        var addedCar = await _adminService.AddCar(newCar.AdminId.Value, newCar);
        return Ok(addedCar);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}
//update car details endpoint
[HttpPut("editCar/{carId}")]
public async Task<IActionResult> EditCar(int carId, [FromBody] Car updatedCar)
{
    ModelState.Clear(); // Disable model validation if needed

    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        var result = await _adminService.EditCar(carId, updatedCar);
        if (result == null)
        {
            return NotFound(new { message = "Car not found." });
        }

        return Ok(result);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}

//delete car listing endpoint
[HttpDelete("deleteCar/{carId}")]
public async Task<IActionResult> DeleteCar(int carId)
{
    try
    {
        var success = await _adminService.DeleteCar(carId);
        if (!success)
        {
            return NotFound(new { message = "Car not found." });
        }

        return NoContent();
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}





    }
}
