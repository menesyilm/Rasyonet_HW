using Microsoft.EntityFrameworkCore;
using Rasyonet_HW.API.Data;
using Rasyonet_HW.API.Models;

namespace Rasyonet_HW.API.Repositories
{
    public class StockRepository : IStockRepository
    {
        private readonly AppDbContext _context;

        public StockRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Stock>> GetAllAsync()
        {
            return await _context.Stocks
                .Include(s => s.PriceSnapshot)
                .ToListAsync();
        }

        public async Task<Stock?> GetBySymbolAsync(string symbol)
        {
            return await _context.Stocks
                .Include(s => s.PriceSnapshot)
                .FirstOrDefaultAsync(s => s.Symbol == symbol.ToUpper());
        }

        public async Task<Stock> AddAsync(Stock stock)
        {
            _context.Stocks.Add(stock);
            await _context.SaveChangesAsync();
            return stock;
        }

        public async Task DeleteAsync(Stock stock)
        {
            _context.Stocks.Remove(stock);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(string symbol)
        {
            return await _context.Stocks
                .AnyAsync(s => s.Symbol == symbol.ToUpper());
        }
    }
}