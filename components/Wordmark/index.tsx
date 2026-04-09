import classNames from 'classnames';
import { SITE_NAME } from 'lib/branding';
import styles from './Wordmark.module.scss';

export type WordmarkSize = 'nav' | 'footer' | 'dashboard';

type Props = {
  className?: string;
  size?: WordmarkSize;
};

const sizeClass = {
  nav: styles.sizeNav,
  footer: styles.sizeFooter,
  dashboard: styles.sizeDashboard,
} satisfies Record<WordmarkSize, string>;

const wordmarkKd = SITE_NAME.slice(0, 2);
const wordmarkRest = SITE_NAME.slice(2);

const Wordmark = ({ className, size = 'nav' }: Props) => (
  <span className={classNames(styles.wordmark, sizeClass[size], className)}>
    <span className={styles.kd}>{wordmarkKd}</span>
    <span className={styles.insight}>{wordmarkRest}</span>
  </span>
);

export default Wordmark;
