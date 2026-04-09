import Link from 'next/link';
import { useScrollTrigger } from '@mui/material';
import classNames from 'classnames';
import styles from './Navbar.module.scss';
import MenuIcon from '@mui/icons-material/Menu';
import Wordmark from 'components/Wordmark';
import { SIGN_IN_HUB_PATH } from 'lib/authEntry';

type Menu = {
  text: string;
  path: string;
  variant: 'link' | 'primary';
};

export type NavbarProps = {
  dark?: boolean;
  setOpen?: () => void;
  /** Unused; kept for API compatibility with older layouts */
  logoColor?: string;
  home?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ dark = false, setOpen, home = false }: NavbarProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 80,
  });

  const menus: Menu[] = [
    { text: 'Solutions', path: '/#solutions', variant: 'link' },
    { text: 'Use cases', path: '/#use-cases', variant: 'link' },
    { text: 'Pricing', path: '/#pricing', variant: 'link' },
    { text: 'Book A Demo', path: SIGN_IN_HUB_PATH, variant: 'primary' },
  ];

  return (
    <nav
      className={classNames(`${styles.navbar} padding-wrapper`, {
        [styles.active]: trigger || dark,
      })}>
      <div className={styles['navbar-content']}>
        <div className={styles['navbar-content-box']}>
          <Link href="/" className={styles.logoLink} aria-label="KDInsight home">
            <Wordmark size="nav" />
          </Link>
        </div>
        <div className={styles['sidebar-desktop']}>
          {menus.map((menu) => {
            const isPrimary = menu.variant === 'primary';
            const linkClass =
              trigger || dark
                ? isPrimary
                  ? 'button-trigger'
                  : 'link-trigger'
                : isPrimary
                ? 'button'
                : 'link';
            const homeClass = home ? (trigger ? 'home-trigger' : 'home') : '';
            return (
              <div className={styles['navbar-content-box']} key={menu.path + menu.text}>
                <Link href={menu.path} className={`ui-button primary ${linkClass} ${homeClass}`}>
                  {menu.text}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles['sidebar-trigger']} onClick={setOpen}>
        <MenuIcon
          style={{ fontSize: 30 }}
          htmlColor={dark && trigger ? '#ffffff' : '#1a1a1a'}
          sx={{ opacity: 0.9 }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
