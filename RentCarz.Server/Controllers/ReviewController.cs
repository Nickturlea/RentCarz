using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;

namespace RentCarz.Server.Controllers
{

    [ApiController]
    [Route("api/review")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;
        private readonly AppDbContext _context;

        public ReviewController(ReviewService reviewService, AppDbContext context)
        {
            _reviewService = reviewService;
            _context = context;
        }
        


        [HttpPost("addReview")]
        public async Task<IActionResult> AddReview([FromBody] Review data)
        {
            var review = await _reviewService.addReview(data.MemberId, data.Rating, data.Comment, data.ReviewDate);

            return Ok(data);
        }

        [HttpPost("updateReview")]
        public async Task<IActionResult> Reserve([FromBody] Review data)
        {

            return Ok();
        }

        // GET: api/review/getReviews
        [HttpGet("getReviews")]
        public async Task<IActionResult> GetReviews()
        {
            var reviews = await _reviewService.getReviews();

            return Ok(reviews);
        }

        // GET: api/review/getUsers
        [HttpGet("getUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var members = await _reviewService.getUsers();

            return Ok(members);
        }

        // GET: api/review/hasReviewed
        [HttpGet("hasReviewed/{id}")]
        public async Task<IActionResult> GetUsers(int id)
        {
            bool isReviewed = await _reviewService.hasReviewed(id);

            return Ok(isReviewed);
        }
    }

}