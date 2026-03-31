using perfumeshopbackend.DTO.CategoryDTO;

using perfumeshopbackend.Repositories.Interfaces;
using perfumeshopbackend.Services.Interface;
using perfumeshopbackend.Models;

namespace perfumeshopbackend.Services.Implementation
{
    
    
        public class CategoryService : ICategoryService
        {
            private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        private readonly IGenericRepository<Models.Category> _repo;
            public CategoryService(ICategoryRepository categoryRepository, IGenericRepository<Category> repo)
            {
                _categoryRepository = categoryRepository;
                _repo = repo;
            }
            public async Task<IEnumerable<CategoryDto>> GetAllAsync()

            {
                var allCategories = await _categoryRepository.GetAllAsync();
                return allCategories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                }).ToList();
            }
            public async Task<CategoryDto?> GetByIdAsync(int id)
            {
                var category = await _categoryRepository.GetByIdAsync(id);
                return category == null ? null : new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };
            }
            public async Task<CategoryDto> AddAsync(CategoryDto categoryDTO)
            {
                var newCategory = new Category
                {
                    Name = categoryDTO.Name
                };
                await _repo.AddAsync(newCategory);
                await _repo.SaveChangesAsync();
                categoryDTO.Id = newCategory.Id;
                return categoryDTO;
            }
            public async Task<CategoryDto> UpdateAsync(int id, CategoryDto dto)
            {
                var category = await _categoryRepository.GetByIdAsync(id);
                if (category == null)
                    throw new KeyNotFoundException("Category not found");
                category.Name = dto.Name;

                _categoryRepository.Update(category);

                await _categoryRepository.SaveChangesAsync();
                return new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };
            }

            public async Task<bool> DeleteAsync(int id)
            {
                var category = await _categoryRepository.GetByIdAsync(id);
                if (category == null)
                {
                    throw new KeyNotFoundException("Category not found");
                }
                await _categoryRepository.DeleteAsync(id);
                return true;
            }
       
    }
}
