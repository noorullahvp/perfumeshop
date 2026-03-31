using perfumeshopbackend.Models;


namespace perfumeshopbackend.Repositories.Interfaces
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
     
        Task<Order?> GetOrderWithItemsByIdAsync(int orderId, int userId);
        Task<Order?> GetByRazorpayOrderIdAsync(string razorpayOrderId);
    }
}
