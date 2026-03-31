using perfumeshopbackend.Common;

namespace perfumeshopbackend.Services.Interface
{
    public interface IWishlistService
    {

        Task<ApiResponse<object>> GetWishlistAsync(int userId);
        Task<ApiResponse<string>> ToggleWishlistAsync(int userId, int productId);
    }
}
