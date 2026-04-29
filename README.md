# Rasyonet HomeWork

A simple internal tool for tracking stock prices and monitoring watchlist performance.

---

## What it does

- Add stocks to a personal watchlist
- Fetch real-time price data from Finnhub API
- View price history and top gainers analytics
- Clean REST API with Swagger documentation
- React frontend for interacting with the data

---

## Project Structure

Rasyonet_HW/
├── Rasyonet_HW.API/
│   ├── Controllers/       → HTTP endpoints
│   ├── Services/          → Business logic
│   ├── Repositories/      → Database access
│   ├── External/          → Finnhub API client
│   ├── Models/            → Database entities
│   ├── DTOs/              → Request & response shapes
│   ├── Data/              → DbContext & migrations
│   └── Configuration/     → Strongly-typed settings
│
└── Rasyonet_HW.UI/
└── src/
├── components/    → Header, tables, forms, popup
├── styles/        → Global styles and color palette
└── api.js         → Axios API calls

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

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get watchlist |
| POST | `/api/stocks/watch` | Add stock |
| DELETE | `/api/stocks/{symbol}` | Remove stock |
| POST | `/api/stocks/{symbol}/refresh` | Fetch latest price |
| GET | `/api/stocks/analytics/top-gainers` | Top N gainers |