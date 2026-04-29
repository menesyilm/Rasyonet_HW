import { useState } from 'react';
import { styles } from '../styles/styles';
import ConfirmPopup from './ConfirmPopup';

export default function WatchlistTable({ watchlist, onRefresh, onRemove }) {
  const [pendingRemove, setPendingRemove] = useState(null);

  const handleRemoveClick = (symbol) => {
    setPendingRemove(symbol);
  };

  const handleConfirm = () => {
    onRemove(pendingRemove);
    setPendingRemove(null);
  };

  const handleCancel = () => {
    setPendingRemove(null);
  };

  if (watchlist.length === 0) {
    return (
      <div style={styles.card}>
        <p style={styles.empty}>No stocks in watchlist yet.</p>
      </div>
    );
  }

  return (
    <>
      {pendingRemove && (
        <ConfirmPopup
          symbol={pendingRemove}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
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
                    <span style={{
                      color: stock.latestChangePercent >= 0 ? '#22c55e' : '#ef4444',
                      fontWeight: 600,
                    }}>
                      {stock.latestChangePercent >= 0 ? '+' : ''}
                      {stock.latestChangePercent.toFixed(2)}%
                    </span>
                  ) : '—'}
                </td>
                <td style={styles.td}>
                  {new Date(stock.addedAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button className="btn-refresh" onClick={() => onRefresh(stock.symbol)}>
                    ↻ Refresh
                  </button>
                  <button className="btn-delete" onClick={() => handleRemoveClick(stock.symbol)}>
                    ✕ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}