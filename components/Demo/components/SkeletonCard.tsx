import React from 'react';
import styles from '../DemoCatalog.module.scss';

const SkeletonCard = () => {
  return (
    <div className={`${styles.card} ${styles.skeleton}`}>
      <div className={styles.skeletonCategory} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonSummary} />
      <div className={styles.skeletonSummary} style={{ width: '80%' }} />
      <div className={styles.skeletonHighlights} />
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonPrice} />
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  );
};

export default SkeletonCard;
