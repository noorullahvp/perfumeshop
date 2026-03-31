using perfumeshopbackend.Common;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;
using perfumeshopbackend.Services.Interface;

namespace perfumeshopbackend.Services.Implementation
{
    public class CartService : ICartService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICartRepository _cartRepository;

        public CartService(IProductRepository productRepository, ICartRepository cartRepository)
        {
            _productRepository = productRepository;
            _cartRepository = cartRepository;
        }

        public async Task<ApiResponse<string>> AddToCartAsync(int userId, int productId, int quantity)
        {
            var product = await _productRepository.GetProductWithDetailsAsync(productId);
            if (product == null)
                return new ApiResponse<string>(404, "Product not found");
            if (!product.IsActive)
                return new ApiResponse<string>(400, "Product is deactivated");
            if (!product.InStock)
                return new ApiResponse<string>(400, "Product is out of stock");
            if (quantity < 1 || quantity > 5)
                return new ApiResponse<string>(400, "Quantity must be between 1 and 5");

            
            var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);

            if (cart == null)
            {
                cart = await _cartRepository.CreateCartAsync(userId);
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (existingItem != null)
            {
                if (existingItem.Quantity + quantity > 5)
                    return new ApiResponse<string>(400, "Quantity cannot exceed 5 per item");

                existingItem.Quantity += quantity;
            }
            else
            {
                var firstImage = product.Images?.FirstOrDefault()?.ImageUrl;

                cart.Items.Add(new CartItems
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Quantity = quantity,
                    ImageUrl = firstImage
                });
            }

            await _cartRepository.SaveChangesAsync();
            return new ApiResponse<string>(200, "Product added to cart successfully");
        }

        public async Task<ApiResponse<object>> GetCartForUserAsync(int userId)
        {
            var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);

            if (cart == null || cart.Items == null || !cart.Items.Any())
                return new ApiResponse<object>(200, "Cart is empty", new { Items = Array.Empty<object>() });

            var responseData = new
            {
                TotalQuantity = cart.Items.Sum(i => i.Quantity),
                TotalPrice = cart.Items.Sum(i => i.Price * i.Quantity),
                Items = cart.Items.Select(i => new
                {
                    i.Id,
                    i.ProductId,
                    i.Name,
                    i.Price,
                    i.Quantity,
                    i.ImageUrl
                })
            };

            return new ApiResponse<object>(200, "Cart fetched successfully", responseData);
        }

        public async Task<ApiResponse<string>> UpdateCartItemAsync(int userId, int cartItemId, int quantity)
        {
            if (quantity < 1 || quantity > 5)
                return new ApiResponse<string>(400, "Quantity must be between 1 and 5");

            var cartItem = await _cartRepository.GetCartItemByIdAsync(cartItemId, userId);

            if (cartItem == null)
                return new ApiResponse<string>(404, "Cart item not found");

            cartItem.Quantity = quantity;
            _cartRepository.Update(cartItem);

            await _cartRepository.SaveChangesAsync();
            return new ApiResponse<string>(200, "Cart item updated successfully");
        }

        public async Task<ApiResponse<string>> RemoveCartItemAsync(int userId, int cartItemId)
        {
            var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);

            if (cart == null || !cart.Items.Any())
                return new ApiResponse<string>(404, "Cart is empty");

            var cartItem = cart.Items.FirstOrDefault(i => i.Id == cartItemId);

            if (cartItem == null)
                return new ApiResponse<string>(404, "Cart item not found");

            cart.Items.Remove(cartItem);

            await _cartRepository.SaveChangesAsync();
            return new ApiResponse<string>(200, "Item removed successfully");
        }

        public async Task<ApiResponse<string>> ClearCartAsync(int userId)
        {
            var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);

            if (cart?.Items == null || !cart.Items.Any())
                return new ApiResponse<string>(200, "Cart already empty");

            cart.Items.Clear();

            await _cartRepository.SaveChangesAsync();
            return new ApiResponse<string>(200, "Cart cleared successfully");
        }
    }
}
