namespace perfumeshopbackend.Services.Implementation;
using perfumeshopbackend.Common;
using Microsoft.Extensions.Options;
using perfumeshopbackend.DTO.PaymentDTO;
using perfumeshopbackend.Enums;
using perfumeshopbackend.Models;
using perfumeshopbackend.Repositories.Interfaces;
using Razorpay.Api;
using perfumeshopbackend.Repositories.Implementation;
using RazorpayOrder = Razorpay.Api.Order;

public class PaymentService : IPaymentService
{
    private readonly RazorpaySettings _razorpaySettings;
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;

    public PaymentService(IOptions<RazorpaySettings> razorpaySettings, IOrderRepository orderRepository, ICartRepository cartRepository)
    {
        _razorpaySettings = razorpaySettings.Value;
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
    }

    public async Task<ApiResponse<object>> CreateOrderAsync(int userId, PaymentRequestDto dto)
    {
        if (dto.Amount <= 0)
            return new ApiResponse<object>(400, "Amount must be greater than zero");

        try
        {
            var client = new RazorpayClient(_razorpaySettings.Key, _razorpaySettings.Secret);
            var options = new Dictionary<string, object>
            {
                { "amount", (int)(dto.Amount * 100) },
                { "currency", "INR" },
                { "receipt", Guid.NewGuid().ToString() },
                { "payment_capture", 1 }
            };

            RazorpayOrder razorpayOrder = client.Order.Create(options);
            var cart = await _cartRepository.GetCartWithItemsByUserIdAsync(userId);
            var order = new perfumeshopbackend.Models.Order
            {
                UserId = userId,
                TotalAmount = dto.Amount,
                PaymentStatus = PaymentStatus.Pending,
                PaymentMethod = PaymentMethods.Razorpay,
                OrderStatus = OrderStatus.Pending,
                BillingStreet = dto.BillingStreet,
                BillingCity = dto.BillingCity,
                BillingState = dto.BillingState,
                BillingZip = dto.BillingZip,
                BillingCountry = dto.BillingCountry,
                RazorpayOrderId = razorpayOrder["id"].ToString(),
                CreatedOn = DateTime.UtcNow,
                Items = cart.Items.Select(ci => new OrderItems
                {
                    ProductId = ci.ProductId,
                    Name = ci.Product.Name,
                    Price = ci.Price,
                    Quantity = ci.Quantity,
                    ImageUrl = ci.ImageUrl
                }).ToList()
            };
            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();


            var data = new
            {
                orderId = order.RazorpayOrderId,
                amount = order.TotalAmount,
                currency = "INR",
                key = _razorpaySettings.Key
            };

            return new ApiResponse<object>(200, "Order created", data);
        }
        catch (Exception ex)
        {
            return new ApiResponse<object>(500, ex.InnerException?.Message ?? ex.Message);
        }
    }

    public async Task<ApiResponse<object>> VerifyPaymentAsync(PaymentVerifyDto dto)
    {
        if (!perfumeshopbackend.Common.Utils.VerifyPaymentSignature(dto.OrderId, dto.PaymentId, dto.Signature, _razorpaySettings.Secret))
            return new ApiResponse<object>(400, "Invalid payment signature");


        var order = await _orderRepository.GetByRazorpayOrderIdAsync(dto.OrderId);
        if (order != null)
        {
            order.PaymentStatus = PaymentStatus.Completed;
            order.PaymentId = dto.PaymentId;
            order.ModifiedOn = DateTime.UtcNow;

            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();

            await _cartRepository.ClearCartForUserAsync(order.UserId);

            return new ApiResponse<object>(200, "Payment verified and cart cleared successfully");
        }

        return new ApiResponse<object>(404, "Order not found");
    }
} 