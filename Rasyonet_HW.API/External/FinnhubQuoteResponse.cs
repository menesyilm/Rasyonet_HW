namespace Rasyonet_HW.API.External
{
    public class FinnhubQuoteResponse
    {
        public decimal C { get; set; }  // Current price
        public decimal D { get; set; }  // Change
        public decimal Dp { get; set; } // Change percent
        public decimal H { get; set; }  // High price of the day
        public decimal L { get; set; }  // Low price of the day
        public decimal O { get; set; }  // Open price of the day
        public decimal Pc { get; set; } // Previous close price
    }
}
