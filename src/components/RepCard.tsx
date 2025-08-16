import React, { useEffect, useRef, useState } from 'react';
import type { Representative } from '../types/Representative';
import gsap from 'gsap';
import styles from '../styles/RepCard.module.css';

interface RepCardProps {
  rep: Representative;
  uniqueId: string;
  expandedId: string | null;
  index: number;
  column: 'withYou' | 'againstYou';
  onCardClick: () => void;
}

export function RepCard({
  rep,
  uniqueId,
  expandedId,
  index,
  column,
  onCardClick,
}: RepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle resize so layout updates without refresh
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    const isExpanded = expandedId === uniqueId;

    if (isExpanded) {
      // Expanded animation — works on both mobile & desktop
      gsap.to(cardRef.current, {
        duration: 0.4,
        zIndex: 1000,
        scale: 1,
        width: isMobile ? '70%' : 400,
        height: 'auto',
        maxHeight: 800,
        padding: '2rem',
        x: isMobile ? 0 : column === 'withYou' ? 50 : -50,
        y: 0,
        ease: 'power3.out',
        clearProps: isMobile ? 'position,top,left' : '',
      });
    } else if (expandedId) {
      // Other cards when one is expanded
      if (isMobile) {
        gsap.set(cardRef.current, {
          clearProps: 'all', // let them flow naturally
        });
      } else {
        const isSameColumn = column === expandedId.split('-')[0];
        const offsetX = isSameColumn ? 0 : column === 'withYou' ? -100 : 50;

        gsap.to(cardRef.current, {
          duration: 0.4,
          scale: 0.9,
          x: offsetX,
          y: 0,
          zIndex: 1,
          ease: 'power2.out',
          width: 260,
          padding: '1rem 1.25rem',
        });
      }
    } else {
      // Default card positioning
      if (isMobile) {
        gsap.set(cardRef.current, {
          clearProps: 'all', // no manual positioning on mobile
        });
      } else {
        const baseX = column === 'withYou' ? 0 : 25;
        const baseY = 100 * index;

        gsap.to(cardRef.current, {
          duration: 0.4,
          x: baseX,
          y: baseY,
          scale: 1,
          zIndex: index + 1,
          width: 260,
          padding: '1rem 1.25rem',
          ease: 'power2.out',
        });
      }
    }
  }, [expandedId, uniqueId, column, index, isMobile]);

  return (
    <div
      className={`${styles.repCard} ${
        expandedId === uniqueId ? styles.expanded : ''
      }`}
      ref={cardRef}
      onClick={onCardClick}
      style={{
        position: isMobile ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        cursor: 'pointer',
      }}
    >
        <div className={styles.banner}>
            
      <h4 className={styles.name}>{rep.name}</h4>
      </div>
      <p className={styles.role}>
        <em>{rep.role}</em>
      </p>
      <p className={styles.level}>{rep.level}</p>
      <p className={styles.party}>{rep.party}</p>
      <p className={styles.reason}>{rep.reason}</p>
    </div>
  );
}
