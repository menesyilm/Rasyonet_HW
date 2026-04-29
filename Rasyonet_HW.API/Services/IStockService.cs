using Rasyonet_HW.API.Models;

namespace Rasyonet_HW.API.Services
{
    public interface IStockService
    {
        Task<IEnumerable<Stock>> GetWatchlistAsync();
        Task<Stock?> AddToWatchlistAsync(string symbol, string companyName);
        Task<bool> RemoveFromWatchlistAsync(string symbol);
        Task<PriceSnapshot?> RefreshPriceAsync(string symbol);
        Task<IEnumerable<Stock>> GetTopGainersAsync(int count);
    }
}