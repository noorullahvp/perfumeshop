using perfumeshopbackend.Common;
using perfumeshopbackend.DTO;
using perfumeshopbackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace perfumeshopbackend.Services.Interface
{
    public interface IUserService
    {
        Task<ApiResponse<IEnumerable<User>>> GetAllUsersAsync();
        Task<ApiResponse<User>> GetUserByIdAsync(int id);

        Task<ApiResponse<string>> BlockUnblockUserAsync(int id);
        Task<ApiResponse<string>> SoftDeleteUserAsync(int id);
    }
}
