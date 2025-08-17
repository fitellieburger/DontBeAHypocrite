// components/Rules.tsx
import styles from "../styles/Rules.module.css";

export function Rules() {
  return (
    <div className={styles.rules}>
      <h2>Rules</h2>
      <ul>
        <li>Rule 1: Prioritize.</li>
        <li>Rule 2: Don't be an asshole. </li>
        <li>Rule 3: Meet the challenge. 
            <span className={styles.breakOnMobile}> Prove Chat wrong.</span>
        </li>
      </ul>
    </div>
  );
}
