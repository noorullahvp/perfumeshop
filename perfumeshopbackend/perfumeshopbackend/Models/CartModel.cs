using System.Collections.Generic;
namespace perfumeshopbackend.Models
{
    public class Cart : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<CartItems> Items { get; set; } = new List<CartItems>();
    }
}
