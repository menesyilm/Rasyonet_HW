import { styles } from '../styles/styles';

export default function WatchlistTable({ watchlist, onRefresh, onRemove }) {
  if (watchlist.length === 0) {
    return (
      <div style={styles.card}>
        <p style={styles.empty}>No stocks in watchlist yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Symbol', 'Company', 'Price', 'Change %', 'Added', 'Actions'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {watchlist.map((stock) => (
            <tr key={stock.id} style={styles.tr}>
              <td style={styles.td}>
                <span style={styles.symbol}>{stock.symbol}</span>
              </td>
              <td style={styles.td}>{stock.companyName}</td>
              <td style={styles.td}>
                {stock.latestPrice ? `$${stock.latestPrice.toFixed(2)}` : '—'}
              </td>
              <td style={styles.td}>
                {stock.latestChangePercent != null ? (
                  <span style={{ color: stock.latestChangePercent >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                    {stock.latestChangePercent >= 0 ? '+' : ''}
                    {stock.latestChangePercent.toFixed(2)}%
                  </span>
                ) : '—'}
              </td>
              <td style={styles.td}>
                {new Date(stock.addedAt).toLocaleDateString()}
              </td>
              <td style={styles.td}>
                <button style={styles.btnRefresh} onClick={() => onRefresh(stock.symbol)}>
                  ↻ Refresh
                </button>
                <button style={styles.btnDelete} onClick={() => onRemove(stock.symbol)}>
                  ✕ Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}