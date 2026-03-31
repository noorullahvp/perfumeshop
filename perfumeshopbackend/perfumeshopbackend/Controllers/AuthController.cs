using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using perfumeshopbackend.Common;
using perfumeshopbackend.DTO.AuthDTO;
using perfumeshopbackend.Services.Interface;
using System;
using System.Threading.Tasks;

namespace perfumeshopbackend.Controllers  
{
    [Route("api/[controller]")]        
    [ApiController]    
    public class AuthController : ControllerBase    
    {
        private readonly IAuthService _authService;   

        public AuthController(IAuthService authService) 
        {
            _authService = authService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            var response = await _authService.RegisterAsync(dto);
            return StatusCode(response.StatusCode, response);
        }
          
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result.StatusCode != 200) return StatusCode(result.StatusCode, result);
            return Ok(new
            {
                message = result.Message,
                accessToken = result.AccessToken,
                refreshToken = result.RefreshToken

            });
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshTokenFromBody)
        {
            var refreshToken = Request.Cookies["refreshToken"] ?? refreshTokenFromBody;
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token missing" });

            var result = await _authService.RefreshTokenAsync(refreshToken);
            if (result.StatusCode != 200) return Unauthorized(result);

            SetTokenCookies(result.AccessToken, result.RefreshToken);

            return Ok(new
            {
                message = result.Message,
                accessToken = result.AccessToken,
                refreshToken = result.RefreshToken
            });
        }

        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token missing" });

            var success = await _authService.RevokeTokenAsync(refreshToken);
            if (!success) return BadRequest(new { message = "Invalid token" });

            DeleteTokenCookies();
            return Ok(new ApiResponse<Object>(200, "Token revoked successfully"));
        }

        private void SetTokenCookies(string accessToken, string refreshToken)
        {
            Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });
        }

        private void DeleteTokenCookies()
        {
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
        }
    }
}
