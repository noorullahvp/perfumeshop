using perfumeshopbackend.Enums;


namespace perfumeshopbackend.DTO.OrderDTO
{
    public class CreateOrderDto
    {


        public PaymentMethods PaymentMethod { get; set; }



        public int UserId { get; set; }

        public PaymentMethods PaymentMethods { get; set; }

        public string BillingStreet { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingZip { get; set; }
        public string BillingCountry { get; set; }
    }
}
