'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SIGN_IN_LOGIN_PATH } from 'lib/authEntry';
import { readUserSession } from 'lib/userSession';
import styles from './AuthGate.module.scss';

type Props = {
  children: React.ReactNode;
};

const AdminOnlyGate = ({ children }: Props) => {
  const router = useRouter();
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      void router.replace(SIGN_IN_LOGIN_PATH);
      return;
    }
    if (session.role !== 'admin') {
      setState('denied');
      return;
    }
    setState('allowed');
  }, [router]);

  if (state === 'loading') {
    return <div className={styles.loading}>Verifying session…</div>;
  }

  if (state === 'denied') {
    return (
      <div className={`${styles.loading} ${styles.denied}`}>
        <p>This area is only available to administrators.</p>
        <Link href="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnlyGate;
