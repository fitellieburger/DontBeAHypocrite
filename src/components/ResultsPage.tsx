import { useState } from 'react';
import type { Representative } from '../types/Representative';
import { RepCard } from './RepCard';
import styles from '../styles/ResultsPage.module.css';
import { useFlyUpUnderTopHalf } from "../hooks/flyUpUnderTop";

interface ResultsPageProps {
  withYouReps: Representative[];
  againstYouReps: Representative[];
  isExiting?: boolean;
  onExitComplete?: () => void;
}

export function ResultsPage({
  withYouReps,
  againstYouReps,
  isExiting,
  onExitComplete,
}: ResultsPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useFlyUpUnderTopHalf(isExiting, onExitComplete);
  const handleCardClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.repResults} ref={ref}>
      <div className={styles.voteSection}>
        <div className={styles.voteIn}>
          <h3>Keep Voting In</h3>
          <div className={styles.cardStack}>
            {withYouReps.map((rep, i) => {
              const id = `withYou-${i}`;
              return (
                <RepCard
                  key={`${rep.name}-${rep.role}`}
                  rep={rep}
                  uniqueId={id}
                  expandedId={expandedId}
                  onCardClick={() => handleCardClick(id)}
                  index={i}
                  column="withYou"
                />
              );
            })}
          </div>
        </div>

        <div className={styles.voteOut}>
          <h3>Vote Out</h3>
          <div className={styles.cardStack}>
            {againstYouReps.map((rep, i) => {
              const id = `againstYou-${i}`;
              return (
                <RepCard
                  key={`${rep.name}-${rep.role}`}
                  rep={rep}
                  uniqueId={id}
                  expandedId={expandedId}
                  onCardClick={() => handleCardClick(id)}
                  index={i}
                  column="againstYou"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
