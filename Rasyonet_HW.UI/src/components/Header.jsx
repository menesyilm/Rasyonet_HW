import { styles } from '../styles/styles';

export default function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <span style={styles.logo}>📈</span>
        <div>
          <h1 style={styles.title}>Rasyonet Finance</h1>
          <p style={styles.subtitle}>Stock Watchlist & Analytics</p>
        </div>
      </div>
    </div>
  );
}