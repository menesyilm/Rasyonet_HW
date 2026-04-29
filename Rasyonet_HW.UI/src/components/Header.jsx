import { styles } from '../styles/styles';

export default function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <div>
          <h1 style={styles.title}>Rasyonet HomeWork</h1>
          <p style={styles.subtitle}>Stock Watchlist & Analytics</p>
        </div>
      </div>
    </div>
  );
}