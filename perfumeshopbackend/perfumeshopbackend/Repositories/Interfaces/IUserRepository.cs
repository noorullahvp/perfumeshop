using System.Threading.Tasks;
namespace perfumeshopbackend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task BlockUnblockUserAsync(int id);
        Task SoftDeleteUserAsync(int id);
    }
}
