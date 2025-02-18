using System;
using System.Security.Claims;
using System.Text;
using RentCarz.Server.Data;
using RentCarz.Server.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


namespace RentCarz.Server.Data
{
    public class Authentication
    {
        //used to config the jwt
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public Authentication(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GenerateJwtToken(Member member)
        {
            //used to configure jwt and to pull my secret key
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];

            //taking the app.settings secret key and converting to a byte array for signing JWT
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            //using security key to sign JWT with that algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //store this in the token
            var claims = new[]
           {
                new Claim("memberId", member.MemberId.ToString()),
                new Claim("username",  member.Username),
            };

            //create token with all the details
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            //used to see token as string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public async Task<string> GenerateRefreshToken(int memberId)
        {
            //create new refresh token given the model
            var refreshToken = new RefreshToken
            {
                MemberId = memberId,
                //generate global unique identifier of 64 to byte array for the random key
                Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                Expires = DateTime.UtcNow.AddHours(1),
                IsRevoked = false
            };

            //add to db
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            //return the token
            return refreshToken.Token;
        }


    }
}