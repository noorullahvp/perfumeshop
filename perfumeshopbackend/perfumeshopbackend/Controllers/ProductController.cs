using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using perfumeshopbackend.Common;
using perfumeshopbackend.DTO.ProductDTO;
using perfumeshopbackend.Services.Interface;
using System.ComponentModel.DataAnnotations;

namespace perfumeshopbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
        {
            var product = await _productService.AddProductAsync(dto);
            return StatusCode(product.StatusCode, product);
        }

        [HttpPut]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> Update([FromForm] UpdateProductdto dto)
        {
            var product = await _productService.UpdateProductAsync(dto);
            return StatusCode(product.StatusCode, product);
        }

        [HttpPatch("status/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ToggleStatus([Range(1, int.MaxValue)] int id)
        {
            var newStatus = await _productService.ToggleProductStatusAsync(id);
            return StatusCode(newStatus.StatusCode, newStatus);
        }

        [HttpGet("ByCategory/{categoryId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _productService.GetProductsByCategoryAsync(categoryId);
            if (products == null || !products.Any())
                return NotFound(new ApiResponse<List<ProductDto>>(404, "No products found in this category"));

            return Ok(new ApiResponse<List<ProductDto>>(200, "Products fetched successfully", products.ToList()));
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
                return NotFound(new ApiResponse<ProductDto>(404, "Product not found"));

            return Ok(new ApiResponse<ProductDto>(200, "Product fetched successfully", product));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(new ApiResponse<List<ProductDto>>(200, "All products fetched successfully", products.ToList()));
        }


        [HttpGet("admin")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var products = await _productService.GetAllProductsAdminAsync();
            return Ok(new ApiResponse<List<ProductDto>>(200, "All products fetched successfully", products.ToList()));
        }


        [HttpGet("filter")]
        [AllowAnonymous]

        public async Task<IActionResult> GetFilteredProducts(
        [FromQuery] string? name,
        [FromQuery] int? categoryId,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStock,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool descending = false)
        {
            var result = await _productService.GetFilteredProducts(
                name, categoryId, brand, minPrice, maxPrice, inStock, page, pageSize, sortBy, descending);

            return StatusCode(result.StatusCode, result);
        }
    }
}
