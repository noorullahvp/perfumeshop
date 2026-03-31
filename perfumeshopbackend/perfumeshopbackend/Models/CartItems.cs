using System.ComponentModel;

namespace perfumeshopbackend.Models
{
    public class CartItems
    {
        public int Id { get; set; }

        // Foreign key
        public int CartId { get; set; }
        public Cart Cart { get; set; }

        public Product Product { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public int Quantity { get; set; } = 1;
        public string? ImageUrl { get; set; }

    }
}
