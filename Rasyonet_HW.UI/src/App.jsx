import { useState, useEffect } from 'react';
import { getWatchlist, addStock, removeStock, refreshPrice, getTopGainers, getTopLosers } from './api';
import { styles } from './styles/styles';
import Header from './components/Header';
import AddStockForm from './components/AddStockForm';
import WatchlistTable from './components/WatchlistTable';
import TopGainersTable from './components/TopGainersTable';
import TopLosersTable from './components/TopLosersTable';

export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('watchlist');

  useEffect(() => {
    fetchWatchlist();
    fetchTopGainers();
    fetchTopLosers();
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
   const fetchTopLosers = async () => {
    try {
      const res = await getTopLosers();
      setTopLosers(res.data);
    } catch {
      showMessage('Failed to fetch top losers.', 'error');
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
    fetchTopLosers();
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
      fetchTopLosers();
    } catch {
      showMessage('Failed to refresh price.', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <Header />

      {message && (
        <div style={{
          ...styles.message,
          background: message.type === 'error' ? '#000000' : '#000000',
          borderColor: message.type === 'error' ? '#706D72' : '#706D72',
          color: '#DFD9E4',
        }}>
          {message.text}
        </div>
      )}

      <AddStockForm
        symbol={symbol}
        companyName={companyName}
        loading={loading}
        onSymbolChange={setSymbol}
        onCompanyChange={setCompanyName}
        onAdd={handleAdd}
      />

      <button
        className={activeTab === 'watchlist' ? 'btn-tab-active' : 'btn-tab'}
        onClick={() => setActiveTab('watchlist')}
      >
        Watchlist ({watchlist.length})
      </button>
      <button
        className={activeTab === 'gainers' ? 'btn-tab-active' : 'btn-tab'}
        onClick={() => setActiveTab('gainers')}
      >
        Top Gainers
      </button>
      <button
        className={activeTab === 'losers' ? 'btn-tab-active' : 'btn-tab'}
        onClick={() => setActiveTab('losers')}
      >
        Top Losers
      </button>

      {activeTab === 'watchlist' && (
        <WatchlistTable
          watchlist={watchlist}
          onRefresh={handleRefresh}
          onRemove={handleRemove}
        />
      )}

      {activeTab === 'gainers' && (
        <TopGainersTable topGainers={topGainers} />
      )}
      {activeTab === 'losers' && (
        <TopLosersTable topLosers={topLosers} />
      )}
    </div>
  );
}