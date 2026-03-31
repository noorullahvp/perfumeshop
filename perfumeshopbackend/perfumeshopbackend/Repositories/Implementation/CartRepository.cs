using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Data;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;
using System.Threading.Tasks;

namespace perfumeshopbackend.Repositories.Implementation
{
    public class CartRepository : GenericRepository<Cart>, ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Cart?> GetCartWithItemsByUserIdAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsDeleted);
        }


        public async Task<CartItems?> GetCartItemByIdAsync(int cartItemId, int userId)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId
                                           && ci.Cart.UserId == userId
                                           && !ci.Cart.IsDeleted);
        }

        public void Update(CartItems cartItem)
        {
            _context.CartItems.Update(cartItem);
        }

        public async Task ClearCartForUserAsync(int userId)
        {
            var cart = await GetCartWithItemsByUserIdAsync(userId);
            if (cart != null && cart.Items.Any())
            {
                _context.CartItems.RemoveRange(cart.Items);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Cart> CreateCartAsync(int userId)
        {
            var cart = new Cart
            {
                UserId = userId,
                Items = new List<CartItems>()
            };

            await _context.Carts.AddAsync(cart);
            await _context.SaveChangesAsync();
            return cart;
        }

    }
}
