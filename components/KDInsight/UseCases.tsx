'use client';

import styles from './kdinsight.module.scss';
import localStyles from './UseCases.module.scss';
import { useHomepageContent } from 'contexts/HomepageContentContext';

const UseCases = () => {
  const { useCases: u } = useHomepageContent();

  return (
    <section className={localStyles.sectionMuted} id="use-cases" aria-labelledby="usecases-heading">
      <div className={styles.sectionInner}>
        <span className={styles.sectionEyebrow}>{u.eyebrow}</span>
        <h2 className={styles.sectionTitle} id="usecases-heading">
          {u.title}
        </h2>
        <p className={styles.sectionLead}>{u.lead}</p>
        <ul className={localStyles.grid}>
          {u.cases.map(({ emoji, label, detail, features }) => (
            <li key={label} className={localStyles.card}>
              <div className={localStyles.cardHeader}>
                <span className={localStyles.emoji} aria-hidden>
                  {emoji}
                </span>
                <h3 className={localStyles.cardLabel}>{label}</h3>
              </div>
              <p className={localStyles.cardDetail}>{detail}</p>
              <ul className={localStyles.featureList} aria-label={`${label} capabilities`}>
                {features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default UseCases;
