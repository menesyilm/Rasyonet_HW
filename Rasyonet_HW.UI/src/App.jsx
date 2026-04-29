import { useState, useEffect } from 'react';
import {
  getWatchlist,
  addStock,
  removeStock,
  refreshPrice,
  getTopGainers,
} from './api';

export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('watchlist');

  useEffect(() => {
    fetchWatchlist();
    fetchTopGainers();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setWatchlist(res.data);
    } catch {
      showMessage('Failed to fetch watchlist.', 'error');
    }
  };

  const fetchTopGainers = async () => {
    try {
      const res = await getTopGainers();
      setTopGainers(res.data);
    } catch {
      showMessage('Failed to fetch top gainers.', 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    if (!symbol || !companyName) return showMessage('Fill in all fields.', 'error');
    setLoading(true);
    try {
      await addStock(symbol, companyName);
      showMessage(`${symbol.toUpperCase()} added to watchlist.`);
      setSymbol('');
      setCompanyName('');
      fetchWatchlist();
    } catch {
      showMessage('Stock already exists or invalid.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (sym) => {
    try {
      await removeStock(sym);
      showMessage(`${sym} removed.`);
      fetchWatchlist();
      fetchTopGainers();
    } catch {
      showMessage('Failed to remove.', 'error');
    }
  };

  const handleRefresh = async (sym) => {
    try {
      await refreshPrice(sym);
      showMessage(`${sym} price refreshed.`);
      fetchWatchlist();
      fetchTopGainers();
    } catch {
      showMessage('Failed to refresh price.', 'error');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>📈</span>
          <div>
            <h1 style={styles.title}>Rasyonet Finance</h1>
            <p style={styles.subtitle}>Stock Watchlist & Analytics</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          ...styles.message,
          background: message.type === 'error' ? '#3b1a1a' : '#1a3b2a',
          borderColor: message.type === 'error' ? '#ef4444' : '#22c55e',
        }}>
          {message.text}
        </div>
      )}

      {/* Add Stock */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add Stock</h2>
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
          <input
            style={styles.input}
            placeholder="Company Name (e.g. Apple Inc.)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <button style={styles.btnPrimary} onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : '+ Add to Watchlist'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'watchlist' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist ({watchlist.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'gainers' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('gainers')}
        >
          Top Gainers
        </button>
      </div>

      {/* Watchlist Tab */}
      {activeTab === 'watchlist' && (
        <div style={styles.card}>
          {watchlist.length === 0 ? (
            <p style={styles.empty}>No stocks in watchlist yet.</p>
          ) : (
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
                      <button style={styles.btnRefresh} onClick={() => handleRefresh(stock.symbol)}>
                        ↻ Refresh
                      </button>
                      <button style={styles.btnDelete} onClick={() => handleRemove(stock.symbol)}>
                        ✕ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Top Gainers Tab */}
      {activeTab === 'gainers' && (
        <div style={styles.card}>
          {topGainers.length === 0 ? (
            <p style={styles.empty}>No data yet. Refresh some stocks first.</p>
          ) : (
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
                    <td style={styles.td}>
                      <span style={styles.rank}>#{index + 1}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.symbol}>{stock.symbol}</span>
                    </td>
                    <td style={styles.td}>{stock.companyName}</td>
                    <td style={styles.td}>
                      {stock.latestPrice ? `$${stock.latestPrice.toFixed(2)}` : '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        color: stock.latestChangePercent >= 0 ? '#22c55e' : '#ef4444',
                        fontWeight: 600,
                      }}>
                        {stock.latestChangePercent >= 0 ? '+' : ''}
                        {stock.latestChangePercent?.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #1e3a5f',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    fontSize: '40px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '20px',
    fontSize: '14px',
  },
  card: {
    background: '#0d1526',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#93c5fd',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  input: {
    background: '#0a0f1e',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '14px',
    flex: '1',
    minWidth: '180px',
    outline: 'none',
  },
  btnPrimary: {
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  tab: {
    background: 'transparent',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '8px 20px',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#1e3a5f',
    color: '#93c5fd',
    borderColor: '#3b82f6',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #1e3a5f',
  },
  tr: {
    borderBottom: '1px solid #0f1f3d',
  },
  td: {
    padding: '14px 12px',
    fontSize: '14px',
  },
  symbol: {
    background: '#1e3a5f',
    color: '#93c5fd',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '13px',
  },
  rank: {
    color: '#64748b',
    fontWeight: '600',
  },
  btnRefresh: {
    background: '#1e3a5f',
    color: '#93c5fd',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  btnDelete: {
    background: '#3b1a1a',
    color: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  empty: {
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
    padding: '40px',
  },
};