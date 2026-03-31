using AutoMapper;
using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Common;
using perfumeshopbackend.DTO.ProductDTO;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Implementation;
using perfumeshopbackend.Repositories.Interfaces;
using perfumeshopbackend.Services.Implementations;
using perfumeshopbackend.Services.Interface;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace perfumeshopbackend.Services.Implementation
{
    public class ProductService:IProductService
    {
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Product> _repository;
        private readonly IProductRepository _productRepository;
        private readonly CloudinaryService _cloudinaryService;

        public ProductService(IMapper mapper, IGenericRepository<Product> repository, IProductRepository productRepository,CloudinaryService cloudinaryService)
        {
            _mapper = mapper;
            _repository = repository;
            _productRepository = productRepository;
            _cloudinaryService = cloudinaryService;
        }
        public async Task<ApiResponse<ProductDto>> AddProductAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                CurrentStock = dto.CurrentStock,
                InStock = dto.CurrentStock > 0,
                SpecialOffer = dto.SpecialOffer,
                IsActive = true,
                Images = new List<ProductImage>()
            };

            foreach (var file in dto.Images)
            {
                var imageUrl = _cloudinaryService.UploadImage(file);
                product.Images.Add(new ProductImage
                {
                    ImageUrl = imageUrl
                });
            }

            await _repository.AddAsync(product);

            try
            {
                await _repository.SaveChangesAsync();
                return new ApiResponse<ProductDto>(200, "Product Added Successfully");
            }
            catch
            {
                return new ApiResponse<ProductDto>(500, "Failed to add product");
            }

        }

        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(UpdateProductdto dto)
        {
            var product = await _repository.GetAsync(
                p => p.Id == dto.Id,
                include: q => q.Include(p => p.Images)

            );

            if (product == null)
                return new ApiResponse<ProductDto>(404, "Product not found");

            if (!string.IsNullOrWhiteSpace(dto.Name)) product.Name = dto.Name.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Description)) product.Description = dto.Description.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Brand)) product.Brand = dto.Brand.Trim();
            if (!string.IsNullOrWhiteSpace(dto.SpecialOffer)) product.SpecialOffer = dto.SpecialOffer.Trim();
            if (dto.Price.HasValue) product.Price = dto.Price.Value;
            if (dto.CategoryId.HasValue) product.CategoryId = dto.CategoryId.Value;
            if (dto.CurrentStock.HasValue)
            {
                product.CurrentStock = dto.CurrentStock.Value;
                product.InStock = dto.CurrentStock.Value > 0;
            }
            if (dto.IsActive.HasValue) product.IsActive = dto.IsActive.Value;      

            if (dto.NewImages != null && dto.NewImages.Any())
            {
                foreach (var file in dto.NewImages)
                {
                    var imageUrl = _cloudinaryService.UploadImage(file);
                    product.Images.Add(new ProductImage
                    {
                        ImageUrl = imageUrl
                    });
                }
            }


            _repository.Update(product);

            try
            {
                await _repository.SaveChangesAsync();
                var productDto = MapToDTO(product);
                return new ApiResponse<ProductDto>(200, "Product updated successfully", productDto);
            }
            catch
            {
                return new ApiResponse<ProductDto>(500, "Failed to update product");
            }
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _repository.GetAsync(
                p => p.Id == id,
                include: q => q
                    
                    .Include(p => p.Images)
                    .Include(p => p.Category)
            );

            if (product == null)
                return null;

            return MapToDTO(product);
        }
        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(int categoryId)
        {
            var products = await _productRepository.GetProductsByCategoryAsync(categoryId);

            if (products == null || !products.Any())
                return new List<ProductDto>();

            return products.Select(MapToDTO).ToList();
        }



        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync(
                include: q => q
                    .Include(p => p.Category)
                    .Include(p => p.Images)
                   
            );

            var activeProducts = products
                .Where(p => p.IsActive && !p.IsDeleted)
                .ToList();

            return activeProducts.Any()
                ? activeProducts.Select(MapToDTO).ToList()
                : new List<ProductDto>();
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAdminAsync()
        {
            var products = await _productRepository.GetAllAsync(
                include: q => q
                    .Include(p => p.Category)
                    .Include(p => p.Images)

            );

            var activeProducts = products.ToList();

            return activeProducts.Any()
                ? activeProducts.Select(MapToDTO).ToList()
                : new List<ProductDto>();
        }



        public async Task<ApiResponse<string>> ToggleProductStatusAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);

            if (product == null)
                return new ApiResponse<string>(404, "Product not found");

            product.IsActive = !product.IsActive;

            _repository.Update(product);
            await _repository.SaveChangesAsync();

            var message = product.IsActive
                ? "Product Activated Successfully"
                : "Product Deactivated Successfully";

            return new ApiResponse<string>(200, message);
        }


        public async Task<ApiResponse<IEnumerable<ProductDto>>> GetFilteredProducts(
        string? name = null,
        int? categoryId = null,
        string? brand = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? inStock = null,
        int page = 1,
        int pageSize = 20,
        string? sortBy = null,
        bool descending = false)
        {
            Expression<Func<Product, bool>> filter = p =>
                  p.IsActive &&
        !p.IsDeleted &&
                (string.IsNullOrWhiteSpace(name) || p.Name.Contains(name) || p.Category.Name.Contains(name) || p.Brand.Contains(name)) &&
                (!categoryId.HasValue || p.CategoryId == categoryId.Value) &&
                (string.IsNullOrWhiteSpace(brand) || p.Brand.Contains(brand)) &&
                (!minPrice.HasValue || p.Price >= minPrice.Value) &&
                (!maxPrice.HasValue || p.Price <= maxPrice.Value) &&
                (!inStock.HasValue || p.InStock == inStock.Value);

            var productsQuery = await _productRepository.GetAllAsync(
                predicate: filter,
                include: q => q.Include(p => p.Category)
                               .Include(p => p.Images)
                             
            );


            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                productsQuery = descending
                    ? productsQuery.OrderByDescending(p => EF.Property<object>(p, sortBy)).ToList()
                    : productsQuery.OrderBy(p => EF.Property<object>(p, sortBy)).ToList();
            }

            var pagedProducts = productsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var productDto = pagedProducts.Select(MapToDTO).ToList();

            return new ApiResponse<IEnumerable<ProductDto>>(200, "Filtered products successfully", productDto);
        }

        private ProductDto MapToDTO(Product p)
        {
            return new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Brand = p.Brand,
                Description = p.Description,
                Price = p.Price,
                InStock = p.InStock,
                CurrentStock = p.CurrentStock,
                SpecialOffer = p.SpecialOffer,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                ImageUrls = p.Images.Select(i => i.ImageUrl).ToList(),
                
                isActive = p.IsActive,
            };
        }
    }
}

