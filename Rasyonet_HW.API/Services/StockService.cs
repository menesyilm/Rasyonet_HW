using Rasyonet_HW.API.External;
using Rasyonet_HW.API.Models;
using Rasyonet_HW.API.Repositories;

namespace Rasyonet_HW.API.Services
{
    public class StockService : IStockService
    {
        private readonly IStockRepository _repository;
        private readonly FinnhubService _finnhubService;

        public StockService(IStockRepository repository, FinnhubService finnhubService)
        {
            _repository = repository;
            _finnhubService = finnhubService;
        }

        public async Task<IEnumerable<Stock>> GetWatchlistAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Stock?> AddToWatchlistAsync(string symbol, string companyName)
        {
            if (await _repository.ExistsAsync(symbol))
                return null;

            var stock = new Stock
            {
                Symbol = symbol.ToUpper(),
                CompanyName = companyName,
                AddedAt = DateTime.UtcNow
            };

            return await _repository.AddAsync(stock);
        }

        public async Task<bool> RemoveFromWatchlistAsync(string symbol)
        {
            var stock = await _repository.GetBySymbolAsync(symbol);
            if (stock == null) return false;

            await _repository.DeleteAsync(stock);
            return true;
        }

        public async Task<PriceSnapshot?> RefreshPriceAsync(string symbol)
        {
            var stock = await _repository.GetBySymbolAsync(symbol);
            if (stock == null) return null;

            var quote = await _finnhubService.GetQuoteAsync(symbol);
            if (quote == null) return null;

            var snapshot = new PriceSnapshot
            {
                StockId = stock.Id,
                CurrentPrice = quote.C,
                OpenPrice = quote.O,
                HighPrice = quote.H,
                LowPrice = quote.L,
                PreviousClose = quote.Pc,
                ChangePercent = quote.Dp,
                FetchedAt = DateTime.UtcNow
            };

            stock.PriceSnapshot.Add(snapshot);
            await _repository.SaveChangesAsync();

            return snapshot;
        }

        public async Task<IEnumerable<Stock>> GetTopGainersAsync(int count)
        {
            var stocks = await _repository.GetAllAsync();

            // Strategy Pattern — sıralama mantığı burada izole edildi.
            return stocks
                .Where(s => s.PriceSnapshot.Any())
                .OrderByDescending(s => s.PriceSnapshot
                    .OrderByDescending(p => p.FetchedAt)
                    .First().ChangePercent)
                .Take(count);
        }
        public async Task<IEnumerable<Stock>> GetTopLosersAsync(int count)
        {
            var stocks = await _repository.GetAllAsync();
            return stocks
                .Where(s => s.PriceSnapshot.Any())
                .OrderBy(s => s.PriceSnapshot
                    .OrderByDescending(p => p.FetchedAt)
                    .First().ChangePercent)
                .Take(count);
        }
    }
}