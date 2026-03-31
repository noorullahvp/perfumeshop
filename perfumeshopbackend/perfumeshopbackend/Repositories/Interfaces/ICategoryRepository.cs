using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;

namespace perfumeshopbackend.Repositories.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<Category?> GetByNameAsync(string name);
    }
}
