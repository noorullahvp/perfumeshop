using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;

namespace perfumeshopbackend.Repositories.Interfaces
{
    public interface ICartRepository : IGenericRepository<Cart>
    {
        Task<Cart?> GetCartWithItemsByUserIdAsync(int userId);
        Task<CartItems?> GetCartItemByIdAsync(int cartItemId, int userId);
        void Update(CartItems cartItem);
        Task ClearCartForUserAsync(int userId);

        Task<Cart> CreateCartAsync(int userId);
    }
}
