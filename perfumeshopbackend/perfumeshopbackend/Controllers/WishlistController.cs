using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using perfumeshopbackend.Services.Interface;
using perfumeshopbackend.Common;
using System.Security.Claims;

namespace perfumeshopbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                throw new UnauthorizedAccessException("User ID not found in token.");

            return int.Parse(claim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();
            var response = await _wishlistService.GetWishlistAsync(userId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("{productId}")]
        public async Task<IActionResult> ToggleWishlist(int productId)
        {
            var userId = GetUserId();
            var response = await _wishlistService.ToggleWishlistAsync(userId, productId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
