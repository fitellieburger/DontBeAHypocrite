import styles from '../styles/PersistentStance.module.css';

interface PersistentStanceProps {
  part1: string;
  part2: string;
  isSwiping: boolean;
  swipeDirection: string; // more strict typing
}

export function PersistentStance({
  part1,
  part2,
  isSwiping,
  swipeDirection,
}: PersistentStanceProps) {
  const swipeClass = isSwiping
    ? swipeDirection === 'left'
      ? styles.swipeLeftOut
      : swipeDirection === 'right'
      ? styles.swipeRightIn
      : ''
    : '';

  return (
    <div className={`${styles.persistentStance} ${swipeClass}`}>
      <h2 className={styles.heroStatement}>
        <span className={styles.clause}>{part1}</span>
        <br />
        <span className={styles.topic}>{part2}</span>
      </h2>
    </div>
  );
}