using perfumeshopbackend.Common;
using perfumeshopbackend.DTO.ProductDTO;

namespace perfumeshopbackend.Services.Interface
{
    public interface IProductService
    {
        Task<ApiResponse<ProductDto>> AddProductAsync(CreateProductDto dto);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId);
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ApiResponse<ProductDto>> UpdateProductAsync(UpdateProductdto dto);
        Task<ApiResponse<string>> ToggleProductStatusAsync(int id);
        Task<IEnumerable<ProductDto>> GetAllProductsAdminAsync();
        Task<ApiResponse<IEnumerable<ProductDto>>> GetFilteredProducts(
            string? name = null,
            int? categoryId = null,
            string? brand = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            bool? inStock = null,
            int page = 1,
            int pageSize = 20,
            string? sortBy = null,
            bool descending = false);
    }
}
