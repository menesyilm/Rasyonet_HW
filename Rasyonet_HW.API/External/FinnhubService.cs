using System.Text.Json;
using Microsoft.Extensions.Options;
using Rasyonet_HW.API.Configuration;

namespace Rasyonet_HW.API.External
{
    public class FinnhubService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        // Options Pattern kullanımı — FinnhubOptions IOptions<T> aracılığıyla
        // inject ediliyor. API key ve base URL appsettings'ten güvenli şekilde okunur.

        public FinnhubService(HttpClient httpClient, IOptions<FinnhubOptions> options)
        {
            _httpClient = httpClient;
            _apiKey = options.Value.ApiKey;
            _baseUrl = options.Value.BaseUrl;
        }

        public async Task<FinnhubQuoteResponse?> GetQuoteAsync(string symbol)
        {
            var url = $"{_baseUrl}/quote?symbol={symbol}&token={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<FinnhubQuoteResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }
}
