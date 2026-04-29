namespace Rasyonet_HW.API.Configuration
{
    // Options Pattern — appsettings.json'daki Finnhub konfigürasyonunu
    // strongly-typed bir class'a bağlar. Magic string kullanımını önler,
    // dependency injection ile servis katmanına güvenli şekilde taşır.

    public class FinnhubOptions
    {
        public string ApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
    }
}
