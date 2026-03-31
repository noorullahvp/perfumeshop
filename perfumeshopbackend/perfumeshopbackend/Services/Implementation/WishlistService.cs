using perfumeshopbackend.Common;
using perfumeshopbackend.Repositories.Interfaces;
using perfumeshopbackend.Models;
using perfumeshopbackend.Services.Interface;

namespace perfumeshopbackend.Services.Implementation
{
    public class WishlistService : IWishlistService
    {
        private readonly IWishlistRepository _wishlistRepo;
        private readonly IProductRepository _productRepo;

        public WishlistService(IWishlistRepository wishlistRepo, IProductRepository productRepo)
        {
            _wishlistRepo = wishlistRepo;
            _productRepo = productRepo;
        }

        public async Task<ApiResponse<object>> GetWishlistAsync(int userId)
        {
            var items = await _wishlistRepo.GetWishlistByUserAsync(userId);

            var result = items.Select(i => new
            {
                id = i.Id,
                productId = i.ProductId,
                product = new
                {
                    id = i.Product.Id,
                    name = i.Product.Name,
                    price = i.Product.Price,
                    brand = i.Product.Brand,
                    imageUrls = i.Product.Images != null && i.Product.Images.Any()
                        ? i.Product.Images.Select(img => img.ImageUrl).ToList()
                        : new List<string>()
                }
            });

            return new ApiResponse<object>(200, "Wishlist fetched successfully", result);
        }


        public async Task<ApiResponse<string>> ToggleWishlistAsync(int userId, int productId)
        {
            var existing = await _wishlistRepo.GetWishlistItemAsync(userId, productId);

            if (existing != null)
            {
                await _wishlistRepo.RemoveWishlistItemAsync(existing);
                return new ApiResponse<string>(200, "Product removed from wishlist");
            }

            var product = await _productRepo.GetByIdAsync(productId); // Or fetch via repo
            if (product == null || !product.IsActive)
                return new ApiResponse<string>(404, "Product not found or inactive");

            var wishlist = new WishListModel
            {
                UserId = userId,
                ProductId = productId
            };

            await _wishlistRepo.AddWishlistItemAsync(wishlist);

            return new ApiResponse<string>(200, "Product added to wishlist");
        }
    }
}
