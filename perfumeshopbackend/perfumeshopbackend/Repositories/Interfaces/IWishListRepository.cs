

using perfumeshopbackend.Models;

namespace perfumeshopbackend.Repositories.Interfaces
{
    public interface IWishlistRepository
    {
        Task<List<WishListModel>> GetWishlistByUserAsync(int userId);
        Task<WishListModel> GetWishlistItemAsync(int userId, int productId);
        Task AddWishlistItemAsync(WishListModel wishlist);
        Task RemoveWishlistItemAsync(WishListModel wishlist);
    }
}
