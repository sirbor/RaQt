'use client';

import Link from 'next/link';
import styles from './kdinsight.module.scss';
import localStyles from './ClosingCTA.module.scss';
import { useHomepageContent } from 'contexts/HomepageContentContext';
import { SIGN_IN_HUB_PATH } from 'lib/authEntry';

const ClosingCTA = () => {
  const { cta: c } = useHomepageContent();

  return (
    <section className={localStyles.cta} id="cta">
      <div className={styles.sectionInner}>
        <div className={localStyles.panel}>
          <span className={styles.sectionEyebrow}>{c.eyebrow}</span>
          <h2 className={localStyles.title}>{c.title}</h2>
          <p className={localStyles.lead}>{c.lead}</p>
          <div className={localStyles.actions}>
            <Link href={SIGN_IN_HUB_PATH} className="ui-button-2 primary">
              {c.primaryCta}
            </Link>
            <Link href="#pricing" className={localStyles.ghost}>
              {c.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
