'use client';

import Link from 'next/link';
import styles from './kdinsight.module.scss';
import localStyles from './Pricing.module.scss';
import { useHomepageContent } from 'contexts/HomepageContentContext';

const Pricing = () => {
  const { pricing: p } = useHomepageContent();
  const std = p.standard;
  const plus = p.plus;

  return (
    <section className={styles.section} id="pricing" aria-labelledby="pricing-heading">
      <div className={styles.sectionInner}>
        <span className={styles.sectionEyebrow}>{p.eyebrow}</span>
        <h2 className={styles.sectionTitle} id="pricing-heading">
          {p.title}
        </h2>
        <p className={styles.sectionLead}>{p.lead}</p>
        <div className={localStyles.plans}>
          <article className={`${localStyles.plan} ${localStyles.planFeatured}`}>
            <span className={localStyles.ribbon}>{std.ribbon}</span>
            <h3 className={localStyles.planName}>{std.name}</h3>
            <p className={localStyles.planPrice}>
              {std.price} <span className={localStyles.per}>{std.per}</span>
            </p>
            <ul className={localStyles.features}>
              {std.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={localStyles.planCta}>
              <Link href="/sign-in" className="ui-button-2 primary">
                {std.cta}
              </Link>
            </div>
          </article>
          <article className={`${localStyles.plan} ${localStyles.planWaitlist}`}>
            <span className={`${localStyles.ribbon} ${localStyles.ribbonWaitlist}`}>{plus.ribbon}</span>
            <h3 className={localStyles.planName}>{plus.name}</h3>
            <p className={localStyles.planPrice}>
              {plus.price} <span className={localStyles.per}>{plus.per}</span>
            </p>
            <ul className={localStyles.features}>
              {plus.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={localStyles.planCta}>
              <Link href="/sign-in" className="ui-button-2 primary">
                {plus.cta}
              </Link>
            </div>
            <p className={localStyles.planNote}>{plus.note}</p>
          </article>
          <article
            className={`${localStyles.plan} ${localStyles.examplesCard}`}
            aria-labelledby="pricing-examples-heading"
          >
            <h3 className={localStyles.examplesMainTitle} id="pricing-examples-heading">
              {p.examplesTitle}
            </h3>
            <div className={localStyles.examplesBlocks}>
              {p.examples.map((ex) => (
                <div key={ex.label} className={localStyles.exampleBlock}>
                  <p className={localStyles.exampleLabel}>{ex.label}</p>
                  <p className={localStyles.exampleAmount}>{ex.amount}</p>
                </div>
              ))}
            </div>
            <div className={localStyles.paystackSection}>
              <h4 className={localStyles.paystackEyebrow}>{p.paystackTitle}</h4>
              <p className={localStyles.paystackCopy}>{p.paystackCopy}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
