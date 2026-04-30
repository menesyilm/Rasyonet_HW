# Rasyonet HomeWork

A lightweight stock watchlist tool built as an internal finance utility. The goal is to demonstrate clean backend architecture using .NET 10, real-world API integration, and a simple but functional frontend — without overengineering.

---

## Tech Choices

**API: Finnhub**
Free tier offers 60 requests/min which is more than enough for a watchlist tool. Provides real-time quote data with a simple REST interface. Registration takes under a minute, no credit card required.

**Database: Microsoft SQL Server Express**
Chosen for seamless EF Core integration with .NET. SQL Express works out of the box without extra configuration.

**ORM: Entity Framework Core**
Code-first approach with migrations keeps the database schema in sync with the codebase.

---

## Design Patterns

### Repository Pattern
`Repositories/IStockRepository.cs` + `Repositories/StockRepository.cs`

Abstracts all database access behind an interface. The service layer depends on `IStockRepository`, not on EF Core directly. This makes the data layer swappable and the service layer unit-testable with mocked dependencies.

### Options Pattern
`Configuration/FinnhubOptions.cs`

Binds the `Finnhub` section of `appsettings.json` to a strongly-typed class injected via `IOptions<T>`. Eliminates magic strings and centralizes all configuration in one place.

### Strategy Pattern
`Services/StockService.cs` — `GetTopGainersAsync` and `GetTopLosersAsync`

Sorting and ranking logic is isolated per method. Each represents a different strategy for analyzing stock performance. New strategies can be added without modifying existing code.

### Builder Pattern
`Models/StockBuilder.cs`

Handles the construction of `Stock` entities in a clean, chainable way. Keeps object creation logic out of the service layer and makes it easy to extend with validation or default values in the future.

---

## Project Structure

```text
Rasyonet_HW/
├── Rasyonet_HW.API/
│   ├── Controllers/       → HTTP endpoints
│   ├── Services/          → Business logic
│   ├── Repositories/      → Database access (Repository Pattern)
│   ├── External/          → Finnhub API client
│   ├── Models/            → Database entities and StockBuilder
│   ├── DTOs/              → Request & response shapes
│   ├── Data/              → DbContext & migrations
│   └── Configuration/     → Strongly-typed settings (Options Pattern)
│
├── Rasyonet_HW.Tests/
│   └── StockServiceTests.cs → Unit tests with xUnit and Moq
│
└── Rasyonet_HW.UI/
    └── src/
        ├── components/    → Header, tables, forms, popup
        ├── styles/        → Global styles and color palette
        └── api.js         → Axios API calls
```
---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Rasyonet_HW.git
cd Rasyonet_HW
```

### 2. Create your local config
Create `Rasyonet_HW.API/appsettings.Development.json` — this file is git-ignored:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=RasyonetFinanceDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Finnhub": {
    "ApiKey": "YOUR_FINNHUB_API_KEY"
  }
}
```

> Get a free API key at [finnhub.io](https://finnhub.io) — no credit card required.

### 3. Run the backend
```bash
cd Rasyonet_HW.API
dotnet ef database update
dotnet run
```

Swagger UI → `https://localhost:{port}/swagger`

### 4. Run the frontend
```bash
cd Rasyonet_HW.UI
npm install
npm run dev
```

Frontend → `http://localhost:5173`

### 5. Run the tests
```bash
cd Rasyonet_HW.Tests
dotnet test
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get watchlist |
| POST | `/api/stocks/watch` | Add stock |
| DELETE | `/api/stocks/{symbol}` | Remove stock |
| POST | `/api/stocks/{symbol}/refresh` | Fetch latest price from Finnhub |
| GET | `/api/stocks/analytics/top-gainers` | Top N gainers |
| GET | `/api/stocks/analytics/top-losers` | Top N losers |

---

## Trade-offs & Notes

- Price data is fetched on-demand (manual refresh) rather than on a schedule. A background service (`IHostedService`) could automate this in a production scenario.
- No authentication is implemented — intentional for a simple internal tool scope.
- Unit tests cover the service layer. The repository pattern makes it straightforward to mock dependencies and test business logic in isolation.

## Color Palette
<img width="1907" height="593" alt="image" src="https://github.com/user-attachments/assets/006bb6fa-cde1-4e08-ac12-bd27a24c3c0c" />

