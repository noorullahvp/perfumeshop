using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Data;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;

namespace perfumeshopbackend.Repositories.Implementation
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public readonly AppDbContext _context;
        public CategoryRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<Category?> GetByNameAsync(string name)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());
        }
    }
}
