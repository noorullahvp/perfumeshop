using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Data;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace perfumeshopbackend.Repositories.Implementation
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly AppDbContext _context;

        public WishlistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishListModel>> GetWishlistByUserAsync(int userId)
        {
            return await _context.WishList
                .Where(w => w.UserId == userId && !w.IsDeleted && w.Product.IsActive)
                .Include(w => w.Product)
                .ThenInclude(p => p.Images)
                .ToListAsync();
        }

        public async Task<WishListModel> GetWishlistItemAsync(int userId, int productId)
        {
            return await _context.WishList
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId && !w.IsDeleted);
        }

        public async Task AddWishlistItemAsync(WishListModel wishlist)
        {
            _context.WishList.Add(wishlist);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveWishlistItemAsync(WishListModel wishlist)
        {
            _context.WishList.Remove(wishlist);
            await _context.SaveChangesAsync();
        }
    }
}