using Microsoft.AspNetCore.Mvc;
using Rasyonet_HW.API.DTOs;
using Rasyonet_HW.API.Services;

namespace Rasyonet_HW.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StocksController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StocksController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWatchlist()
        {
            var stocks = await _stockService.GetWatchlistAsync();

            var response = stocks.Select(s => new StockResponse
            {
                Id = s.Id,
                Symbol = s.Symbol,
                CompanyName = s.CompanyName,
                AddedAt = s.AddedAt,
                LatestPrice = s.PriceSnapshot.OrderByDescending(p => p.FetchedAt)
                                      .FirstOrDefault()?.CurrentPrice,
                LatestChangePercent = s.PriceSnapshot.OrderByDescending(p => p.FetchedAt)
                                              .FirstOrDefault()?.ChangePercent
            });

            return Ok(response);
        }

        [HttpPost("watch")]
        public async Task<IActionResult> AddToWatchlist([FromBody] AddStockRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Symbol) ||
                string.IsNullOrWhiteSpace(request.CompanyName))
                return BadRequest("Symbol and CompanyName are required.");

            var stock = await _stockService.AddToWatchlistAsync(request.Symbol, request.CompanyName);

            if (stock == null)
                return Conflict($"{request.Symbol.ToUpper()} is already in the watchlist.");

            return CreatedAtAction(nameof(GetWatchlist), new StockResponse
            {
                Id = stock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                AddedAt = stock.AddedAt
            });
        }

        [HttpDelete("{symbol}")]
        public async Task<IActionResult> RemoveFromWatchlist(string symbol)
        {
            var result = await _stockService.RemoveFromWatchlistAsync(symbol);

            if (!result)
                return NotFound($"{symbol.ToUpper()} not found in watchlist.");

            return NoContent();
        }

        [HttpPost("{symbol}/refresh")]
        public async Task<IActionResult> RefreshPrice(string symbol)
        {
            var snapshot = await _stockService.RefreshPriceAsync(symbol);

            if (snapshot == null)
                return NotFound($"{symbol.ToUpper()} not found or Finnhub returned no data.");

            return Ok(new PriceSnapshotResponse
            {
                CurrentPrice = snapshot.CurrentPrice,
                OpenPrice = snapshot.OpenPrice,
                HighPrice = snapshot.HighPrice,
                LowPrice = snapshot.LowPrice,
                PreviousClose = snapshot.PreviousClose,
                ChangePercent = snapshot.ChangePercent,
                FetchedAt = snapshot.FetchedAt
            });
        }

        [HttpGet("analytics/top-gainers")]
        public async Task<IActionResult> GetTopGainers([FromQuery] int count = 5)
        {
            if (count <= 0)
                return BadRequest("Count must be greater than 0.");

            var stocks = await _stockService.GetTopGainersAsync(count);

            var response = stocks.Select(s => new StockResponse
            {
                Id = s.Id,
                Symbol = s.Symbol,
                CompanyName = s.CompanyName,
                AddedAt = s.AddedAt,
                LatestPrice = s.PriceSnapshot.OrderByDescending(p => p.FetchedAt)
                                      .FirstOrDefault()?.CurrentPrice,
                LatestChangePercent = s.PriceSnapshot.OrderByDescending(p => p.FetchedAt)
                                              .FirstOrDefault()?.ChangePercent
            });

            return Ok(response);
        }
    }
}