import { styles } from '../styles/styles';

export default function ConfirmPopup({ symbol, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.popupTitle}>Remove Stock</h2>
        <p style={styles.popupText}>
          Are you sure you want to remove <strong>{symbol}</strong> from your watchlist?
          This action cannot be undone.
        </p>
        <div style={styles.popupActions}>
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}