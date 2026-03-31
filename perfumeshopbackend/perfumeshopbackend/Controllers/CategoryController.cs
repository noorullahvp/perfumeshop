using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using perfumeshopbackend.Common;
using perfumeshopbackend.DTO.CategoryDTO;
using perfumeshopbackend.Services.Interface;

namespace perfumeshopbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;


        }
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {

            var Entities = await _categoryService.GetAllAsync();
            var categoryDTOs = _mapper.Map<List<CategoryDto>>(Entities);
            return Ok(new ApiResponse<List<CategoryDto>>(200, "Categories fetched successfully", categoryDTOs));
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
                return NotFound(new ApiResponse<CategoryDto>(404, "Category Not Found"));
            return Ok(new ApiResponse<CategoryDto>(200, "Category fetched successfully", category));
        }
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CategoryDto dto)
        {
            var result = await _categoryService.AddAsync(dto);
            return Ok(new ApiResponse<CategoryDto>(201, "Category created", result));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
        {
            var result = await _categoryService.UpdateAsync(id, dto);
            if (result == null)
                return NotFound(new ApiResponse<string>(404, "Category not found"));
            return Ok(new ApiResponse<CategoryDto>(200, "Category updated", result));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.DeleteAsync(id);
            if (!success)
                return NotFound(new ApiResponse<string>(404, "Category not found"));

            return Ok(new ApiResponse<string>(200, "Category deleted"));
        }
    }
}
