using Rasyonet_HW.API.Models;

namespace Rasyonet_HW.API.Models
{
    // Builder Pattern — Stock nesnesinin adım adım inşa edilmesini sağlar.
    // Controller veya Service katmanında new Stock { ... } yazmak yerine
    // okunabilir, zincirlenebilir bir API sunar.
    public class StockBuilder
    {
        private readonly Stock _stock = new();

        public StockBuilder WithSymbol(string symbol)
        {
            _stock.Symbol = symbol.ToUpper();
            return this;
        }

        public StockBuilder WithCompanyName(string companyName)
        {
            _stock.CompanyName = companyName;
            return this;
        }

        public Stock Build()
        {
            _stock.AddedAt = DateTime.UtcNow;
            return _stock;
        }
    }
}