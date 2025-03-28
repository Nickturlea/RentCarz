using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RentCarz.Server.Data;
using RentCarz.Server.Models;


namespace RentCarz.Server.Controllers
{

    [ApiController]
    [Route("api/members")]
    public class MemberController : ControllerBase
    {
        private readonly MemberService _memberService;
        private readonly Authentication _authService;
        private readonly AppDbContext _context;

        public MemberController(MemberService memberService, Authentication authService, AppDbContext context)
        {
            _memberService = memberService;
            _authService = authService;
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] Member member)
        {
            if (string.IsNullOrWhiteSpace(member.Username) ||
              string.IsNullOrWhiteSpace(member.Password) ||
        string.IsNullOrWhiteSpace(member.Email) ||
        string.IsNullOrWhiteSpace(member.FullName) ||
        string.IsNullOrWhiteSpace(member.PhoneNumber) ||
        string.IsNullOrWhiteSpace(member.Address))
            {
                return BadRequest(new { message = "All fields are required for signup." });
            }

            // Call service to register the member
            var createdUser = await _memberService.RegisterUser(
         member.Username,
         member.Password,
         member.Email,
         member.FullName,
         member.PhoneNumber,
         member.Address
     );


            if (createdUser == null)
            {
                return BadRequest(new { message = "Member already exists or failed to sign in." });
            }

            return Ok(createdUser);
        }





        [Authorize] //makes it so this endpoint only works if valid jwt
        [HttpPost("checkJwtValid")]
        public IActionResult CheckJwtValid()
        {
            try
            {
                //pull those form my jwt
                var username = User.FindFirst("username")?.Value;
                var memberId = User.FindFirst("memberId")?.Value;

                return Ok(new
                {
                    message = "JWT is still valid",
                    user = new { memberId, username }
                });
            }
            catch (Exception)
            {
                return Unauthorized(new { message = "JWT is invalid or expired" });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Member request)
        {
            try
            {
                //check if null
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Username and password are required!" });
                }

                //check username
                var member = await _context.Members.FirstOrDefaultAsync(m => m.Username == request.Username);
                if (member == null)
                {
                    return Unauthorized(new { message = "Error Unable to find username!" });
                }

                //check pass
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, member.Password);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Error invalid password!" });
                }

                //find and remove old tokens
                var oldTokens = await _context.RefreshTokens
                    .Where(rt => rt.MemberId == member.MemberId)
                    .ToListAsync();
                _context.RefreshTokens.RemoveRange(oldTokens);
                await _context.SaveChangesAsync();

                //generate a fresh refresh token
                string newRefreshToken = await _authService.GenerateRefreshToken(member.MemberId);

                // generate a fresh access token
                var newJwtToken = _authService.GenerateJwtToken(member);


                var memberId = member.MemberId;

                return Ok(new
                {
                    token = newJwtToken,
                    refreshToken = newRefreshToken,
                    userId = memberId

                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error logging in: {ex.Message}" });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            //check body
            if (request == null || string.IsNullOrEmpty(request.Token) || request.MemberId <= 0)
            {
                return BadRequest(new { message = "Invalid request body! Member ID and token are required." });
            }

            //find in db
            var latestToken = await _context.RefreshTokens
                .Where(rt => rt.MemberId == request.MemberId && !rt.IsRevoked)
                .OrderByDescending(rt => rt.Expires)
                .FirstOrDefaultAsync();

            //if empty or expired say login
            if (latestToken == null || latestToken.Token != request.Token || latestToken.Expires < DateTime.UtcNow)
            {
                return Unauthorized(new { message = "Refresh token expired. Please log in again." });
            }

            //generate new jwt
            var member = await _context.Members.FindAsync(request.MemberId);
            string newJwtToken = _authService.GenerateJwtToken(member);

            return Ok(new
            {
                token = newJwtToken,
                refreshToken = latestToken.Token
            });
        }
    }
}