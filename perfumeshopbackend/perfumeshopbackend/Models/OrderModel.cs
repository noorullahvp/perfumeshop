using Microsoft.EntityFrameworkCore;
using perfumeshopbackend.Enums;
using System.Numerics;
using System.Collections.Generic;

namespace perfumeshopbackend.Models
{
    public class Order:BaseEntity
    {
        // Relationships
        public int UserId { get; set; }
        public User User { get; set; }

        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        // Enums instead of free strings
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public PaymentMethods PaymentMethod { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public string BillingStreet { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingZip { get; set; }
        public string BillingCountry { get; set; }

        // Razorpay order ID (required for online payments)
        public string? RazorpayOrderId { get; set; }

        // Payment ID returned by Razorpay after payment
        public string? PaymentId { get; set; }


        // Navigation
        public ICollection<OrderItems> Items { get; set; } = new List<OrderItems>();
   
    }
}
