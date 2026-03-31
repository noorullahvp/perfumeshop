using perfumeshopbackend.Data;
using perfumeshopbackend.Repositories.Interfaces;

namespace perfumeshopbackend.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task BlockUnblockUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null && !user.IsDeleted)
            {
                user.IsBlocked = !user.IsBlocked;
                user.ModifiedOn = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SoftDeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null && !user.IsDeleted)
            {
                user.IsDeleted = true;
                user.DeletedOn = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}