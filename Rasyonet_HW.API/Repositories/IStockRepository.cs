using Rasyonet_HW.API.Models;

namespace Rasyonet_HW.API.Repositories
{
    // Repository Pattern — veritabanı işlemlerini soyutlar.
    // Service katmanı EF Core'a doğrudan bağımlı olmaz,
    // test edilebilirlik ve değiştirilebilirlik artar.
    public interface IStockRepository
    {
        Task<IEnumerable<Stock>> GetAllAsync();
        Task<Stock?> GetBySymbolAsync(string symbol);
        Task<Stock> AddAsync(Stock stock);
        Task DeleteAsync(Stock stock);
        Task<bool> ExistsAsync(string symbol);
        Task SaveChangesAsync();
    }
}