namespace Rasyonet_HW.API.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
        public ICollection<PriceSnapshot> PriceSnapshot { get; set; } = new List<PriceSnapshot>();
    }
}
