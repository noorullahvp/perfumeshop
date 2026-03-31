using System;
using System.Security.Cryptography;
using System.Text;

namespace perfumeshopbackend.Common
{
    public static class Utils
    {
        public static bool VerifyPaymentSignature(string orderId, string paymentId, string razorpaySignature, string secret)
        {
            string text = $"{orderId}|{paymentId}";
            var keyBytes = Encoding.UTF8.GetBytes(secret);
            var textBytes = Encoding.UTF8.GetBytes(text);

            using (var hmac = new HMACSHA256(keyBytes))
            {
                var hash = hmac.ComputeHash(textBytes);
                var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
                return generatedSignature == razorpaySignature;
            }
        }
    }
}
