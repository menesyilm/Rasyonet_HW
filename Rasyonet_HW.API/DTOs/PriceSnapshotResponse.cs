namespace Rasyonet_HW.API.DTOs
{
    public class PriceSnapshotResponse
    {
        public decimal CurrentPrice { get; set; }
        public decimal OpenPrice { get; set; }
        public decimal HighPrice { get; set; }
        public decimal LowPrice { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime FetchedAt { get; set; }
    }
}