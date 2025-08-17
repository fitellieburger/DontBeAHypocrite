import styles from '../styles/PageTitle.module.css';

export function PageTitle() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      className={styles.appHeader}
      onClick={handleRefresh}
      aria-label="Refresh page to make another query"
      type="button"
    >
      Don’t Be a Hypocrite
    </button>
  );
}
