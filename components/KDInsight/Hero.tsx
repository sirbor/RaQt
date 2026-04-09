'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './kdinsight.module.scss';
import heroStyles from './Hero.module.scss';
import { useHomepageContent } from 'contexts/HomepageContentContext';
import { SIGN_IN_HUB_PATH } from 'lib/authEntry';

const Hero = () => {
  const { hero } = useHomepageContent();

  return (
    <section className={heroStyles.hero} id="home">
      <div className={`${styles.sectionInner} ${heroStyles.inner}`}>
        <div className={heroStyles.row}>
          <div className={heroStyles.copy}>
            <span className={styles.sectionEyebrow}>{hero.eyebrow}</span>
            <h1 className={styles.sectionTitle}>{hero.title}</h1>
            <p className={styles.sectionLead}>{hero.lead1}</p>
            {hero.lead2 ? <p className={styles.sectionLead}>{hero.lead2}</p> : null}
            <div className={heroStyles.actions}>
              <Link href="#pricing" className="ui-button-2 primary">
                {hero.primaryCta}
              </Link>
              <Link href={SIGN_IN_HUB_PATH} className={heroStyles.secondaryLink}>
                {hero.secondaryCta}
              </Link>
            </div>
          </div>
          <div className={heroStyles.figure}>
            <Image
              src="/salepoint.jpeg"
              alt="Point of sale and retail workflow supported by KDInsight"
              width={1575}
              height={1326}
              sizes="(max-width: 900px) 100vw, 48vw"
              className={heroStyles.heroImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
