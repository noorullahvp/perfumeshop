using AutoMapper;
using perfumeshopbackend.DTO.CategoryDTO;
using perfumeshopbackend.DTO.OrderDTO;
using perfumeshopbackend.DTO.ProductDTO;
using perfumeshopbackend.Models;

namespace perfumeshopbackend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
           
            CreateMap<Product, ProductDto>();
            CreateMap<CreateProductDto, Product>();
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Order, OrderDto>();
            CreateMap<OrderItems, OrderItemDto>();
        }
    }
}
