import { styles } from '../styles/styles';

export default function TopGainersTable({ topGainers }) {
  if (topGainers.length === 0) {
    return (
      <div style={styles.card}>
        <p style={styles.empty}>No data yet. Refresh some stocks first.</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['Rank', 'Symbol', 'Company', 'Price', 'Change %'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topGainers.map((stock, index) => (
            <tr key={stock.id} style={styles.tr}>
              <td style={styles.td}><span style={styles.rank}>#{index + 1}</span></td>
              <td style={styles.td}><span style={styles.symbol}>{stock.symbol}</span></td>
              <td style={styles.td}>{stock.companyName}</td>
              <td style={styles.td}>
                {stock.latestPrice ? `$${stock.latestPrice.toFixed(2)}` : '—'}
              </td>
              <td style={styles.td}>
                <span style={{ color: stock.latestChangePercent >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  {stock.latestChangePercent >= 0 ? '+' : ''}
                  {stock.latestChangePercent?.toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}