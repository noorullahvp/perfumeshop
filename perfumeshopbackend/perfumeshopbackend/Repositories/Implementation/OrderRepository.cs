using perfumeshopbackend.Repositories.Interfaces;
using perfumeshopbackend.Data;
using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Models;

namespace perfumeshopbackend.Repositories.Implementation
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Order?> GetOrderWithItemsByIdAsync(int orderId, int userId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
        }
        public async Task<Order?> GetByRazorpayOrderIdAsync(string razorpayOrderId)
        {
            return await _context.Orders
                .FirstOrDefaultAsync(o => o.RazorpayOrderId == razorpayOrderId);
        }
    }
}
