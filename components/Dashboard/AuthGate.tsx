'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SIGN_IN_LOGIN_PATH } from 'lib/authEntry';
import { readUserSession } from 'lib/userSession';
import styles from './AuthGate.module.scss';

type Props = {
  children: React.ReactNode;
};

const AuthGate = ({ children }: Props) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      void router.replace(SIGN_IN_LOGIN_PATH);
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return <div className={styles.loading}>Verifying session…</div>;
  }

  return <>{children}</>;
};

export default AuthGate;
