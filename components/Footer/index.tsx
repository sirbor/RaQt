import Link from 'next/link';
import { SIGN_IN_HUB_PATH, SIGN_IN_LOGIN_PATH, SIGN_UP_PATH } from 'lib/authEntry';
import styles from './Footer.module.scss';
import Wordmark from 'components/Wordmark';

const Footer = () => {
  return (
    <section className={styles['footer-section']}>
      <div className={styles['footer-section-top']}>
        <div className={styles['footer-section-brand']}>
          <Wordmark size="footer" className={styles.brandWordmark} />
          <p className={styles.tagline}>
            Commerce infrastructure for the hybrid economy. Unified Commerce. Infinite Insight. One connected record
            for SMEs across East Africa and beyond: sales, inventory, people, wallets, subscriptions, and automated
            channels in a single cloud platform.
          </p>
          <a className={styles.email} href="mailto:hello@kdinsight.com">
            hello@kdinsight.com
          </a>
        </div>
        <nav className={styles['footer-section-nav']} aria-label="Footer">
          <h2>Product</h2>
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#use-cases">Use cases</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href={SIGN_IN_LOGIN_PATH}>Sign in</Link>
          <Link href={SIGN_UP_PATH}>Register</Link>
          <Link href={SIGN_IN_HUB_PATH}>Book A Demo</Link>
          <h2 className={styles.navGroupTitle}>Legal</h2>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/privacy-and-cookies">Privacy and Cookies</Link>
          <Link href="/confidentiality-agreement">Confidentiality Agreement</Link>
        </nav>
      </div>
      <div className={styles['footer-section-disclaimer']}>
        <p>
          Features and pricing are subject to change. Payment processing references third-party providers (e.g.
          Paystack). KDInsight is provided as a software platform; you remain responsible for your business
          compliance and recordkeeping obligations.
        </p>
      </div>
      <footer>
        <p>&copy; {new Date().getFullYear()} KDInsight. All rights reserved.</p>
        <div className={styles.meta}>
          <Link href="/privacy-and-cookies">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
