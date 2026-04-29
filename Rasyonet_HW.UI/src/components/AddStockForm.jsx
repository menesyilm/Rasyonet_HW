import { styles } from '../styles/styles';

export default function AddStockForm({ symbol, companyName, loading, onSymbolChange, onCompanyChange, onAdd }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Add Stock</h2>
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
        />
        <input
          style={styles.input}
          placeholder="Company Name (e.g. Apple Inc.)"
          value={companyName}
          onChange={(e) => onCompanyChange(e.target.value)}
        />
        <button style={styles.btnPrimary} onClick={onAdd} disabled={loading}>
          {loading ? 'Adding...' : '+ Add to Watchlist'}
        </button>
      </div>
    </div>
  );
}