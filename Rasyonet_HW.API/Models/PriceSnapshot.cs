namespace Rasyonet_HW.API.Models
{
    public class PriceSnapshot
    {
        public int Id { get; set; }
        public int StockId { get; set; }

        public decimal CurrentPrice { get; set; }
        public decimal OpenPrice { get; set; }
        public decimal HighPrice { get; set; }
        public decimal LowPrice { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal ChangePercent { get; set; }

        public DateTime FetchedAt { get; set; } = DateTime.UtcNow;
        public Stock Stock { get; set; } = null!;

    }
}
