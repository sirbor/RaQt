'use client';

import Link from 'next/link';
import Wordmark from 'components/Wordmark';
import { useRouter } from 'next/router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearUserSession, readUserSession } from 'lib/userSession';
import styles from './DashboardShell.module.scss';

type Props = {
  children: React.ReactNode;
  activeNav?: 'overview' | 'site' | 'users' | 'orders' | 'demo';
  pageEyebrow?: string;
  pageTitle?: string;
};

const DashboardShell = ({
  children,
  activeNav = 'overview',
  pageEyebrow = 'Today',
  pageTitle = 'Dashboard',
}: Props) => {
  const router = useRouter();
  const session = typeof window !== 'undefined' ? readUserSession() : null;
  const isAdmin = session?.role === 'admin';

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      /* ignore */
    }
    clearUserSession();
    void router.replace('/sign-in');
  };

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar} aria-label="Workspace navigation">
        <Link href="/dashboard" className={styles.brand}>
          <div className={styles.brandText}>
            <Wordmark size="dashboard" className={styles.brandWordmark} />
            <span className={styles.brandHint}>Workspace</span>
          </div>
        </Link>
        <nav className={styles.nav}>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${activeNav === 'overview' ? styles.navItemActive : ''}`}
            aria-current={activeNav === 'overview' ? 'page' : undefined}>
            <DashboardIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Overview
          </Link>
          {isAdmin ? (
            <Link
              href="/dashboard/site"
              className={`${styles.navItem} ${activeNav === 'site' ? styles.navItemActive : ''}`}
              aria-current={activeNav === 'site' ? 'page' : undefined}>
              <EditNoteIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
              Home page
            </Link>
          ) : null}
          {isAdmin ? (
            <Link
              href="/dashboard/users"
              className={`${styles.navItem} ${activeNav === 'users' ? styles.navItemActive : ''}`}
              aria-current={activeNav === 'users' ? 'page' : undefined}>
              <PeopleIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
              Users
            </Link>
          ) : null}
          {isAdmin ? (
            <Link
              href="/dashboard/orders"
              className={`${styles.navItem} ${activeNav === 'orders' ? styles.navItemActive : ''}`}
              aria-current={activeNav === 'orders' ? 'page' : undefined}>
              <ReceiptLongIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
              Orders
            </Link>
          ) : null}
          {isAdmin ? (
            <Link
              href="/dashboard/demo"
              className={`${styles.navItem} ${activeNav === 'demo' ? styles.navItemActive : ''}`}
              aria-current={activeNav === 'demo' ? 'page' : undefined}>
              <PointOfSaleIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
              Demo Catalog
            </Link>
          ) : null}
          <span className={`${styles.navItem} ${styles.navItemDisabled}`} title="Coming soon">
            <PointOfSaleIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Sales
          </span>
          <span className={`${styles.navItem} ${styles.navItemDisabled}`} title="Coming soon">
            <Inventory2Icon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Inventory
          </span>
          <span className={`${styles.navItem} ${styles.navItemDisabled}`} title="Coming soon">
            <BusinessIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Branches
          </span>
          <span className={`${styles.navItem} ${styles.navItemDisabled}`} title="Coming soon">
            <GroupsIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Team
          </span>
          <span className={`${styles.navItem} ${styles.navItemDisabled}`} title="Coming soon">
            <SettingsIcon className={styles.navMuiIcon} aria-hidden sx={{ fontSize: 20 }} />
            Settings
          </span>
        </nav>
        <div className={styles.sidebarFoot}>
          <button type="button" className={styles.signOut} onClick={signOut}>
            <LogoutIcon sx={{ fontSize: 18 }} aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.topbarTitle}>{pageEyebrow}</p>
            <h1 className={styles.topbarHeading}>{pageTitle}</h1>
          </div>
          <div className={styles.topbarActions}>
            <Link href="/" className={styles.homeLink}>
              Back to homepage
            </Link>
            <div className={styles.user}>
              <p className={styles.userEmail}>{session?.email ?? 'Not signed in'}</p>
              <p className={styles.userRole}>{isAdmin ? 'Administrator' : 'Client'}</p>
            </div>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;
