import Link from 'next/link';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Image from 'next/image';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <section className={styles['footer-section']}>
      <div className={styles['footer-section-content']}>
        <img src="/logo-white.png" alt="Pillar Markets Logo footer" width={120} height={60} />
        <p>Digital Infrastructure Powering Private Equity and Venture Captials in Africa</p>
        <a href="mailto:info@pillarmarkets.com">info@raqtsolutions.io</a>
        <div className={styles['button-container']}>
          <a target="_blank" rel="noopener noreferrer" className={styles['icon']}>
            <LinkedInIcon fontSize="large" sx={{ color: 'white', fontSize: 28 }} />
          </a>
          <a target="_blank" className={styles['icon']} rel="noopener noreferrer">
            <TwitterIcon fontSize="large" sx={{ color: 'white', fontSize: 28 }} />
          </a>
        </div>
      </div>
      <div className={styles['footer-section-disclaimer']}>
        <p>
        Past performance does not guarantee future results; historical data and projections may not reflect actual future performance, and all solutions involve risk and may result in partial or total loss.
        RAQT Solutions Inc. entities.
        </p>
      </div>
      <footer>
        <p>Copyright &copy; {new Date().getFullYear()} RAQT Solutions Inc.</p>
        <Link href="/sponsor">Home</Link>
        <Link href="/career">Careers</Link>
        <Link href="/terms-of-service">Terms of Service</Link>
        <Link href="/privacy-and-cookies">Privacy and Cookies</Link>
        <Link href="/confidentiality-agreement">Confidentiality Agreement</Link>
      </footer>
    </section>
  );
};

export default Footer;
