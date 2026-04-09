'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { SIGN_IN_HUB_PATH, SIGN_IN_LOGIN_PATH, SIGN_UP_PATH } from 'lib/authEntry';
import { clearUserSession, readUserSession, writeUserSession } from 'lib/userSession';
import styles from './SignIn.module.scss';

type LoginJson = {
  ok?: boolean;
  role?: 'ADMIN' | 'CLIENT';
  email?: string;
  message?: string;
  error?: string;
};

function loginErrorMessage(status: number, j: LoginJson): string {
  if (j.error === 'invalid_credentials') {
    return 'Invalid email or password.';
  }
  if (j.error === 'email_password_required') {
    return 'Enter your email and password.';
  }
  if (typeof j.message === 'string' && j.message.trim()) {
    return j.message;
  }
  if (status === 503) {
    return 'Sign-in is temporarily unavailable. Check DATABASE_URL and ADMIN_JWT_SECRET in .env.local.';
  }
  if (status === 400) {
    return 'Enter your email and password.';
  }
  return 'Could not sign in. Try again in a moment.';
}

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isReady = router.isReady;
  const isLoginFlow = isReady && router.query.flow === 'login';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }

    try {
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const j = (await loginRes.json().catch(() => ({}))) as LoginJson;

      if (!loginRes.ok || !j.ok || !j.role || !j.email) {
        clearUserSession();
        setError(loginErrorMessage(loginRes.status, j));
        return;
      }

      writeUserSession({
        role: j.role,
        email: j.email,
        signedInAt: Date.now(),
      });
    } catch {
      clearUserSession();
      setError('Network error while signing in.');
      return;
    }

    const destination = readUserSession()?.role === 'client' ? '/demo' : '/dashboard';
    void router.replace(destination);
  };

  if (!isReady) {
    return (
      <div className={styles.authShell}>
        <div className={styles.page}>
          <p className={styles.loadingText}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isLoginFlow) {
    return (
      <div className={styles.authShell}>
        <div className={styles.page}>
        <span className={styles.eyebrow}>KDInsight</span>
        <h1 className={styles.title} id="sign-in-heading">
          Account access
        </h1>
        <p className={styles.subtitle}>
          Create a new workspace account, or sign in with the email and password for your existing client or
          administrator profile. Clients go to the demo use-case marketplace, and administrators go to the dashboard.
        </p>
        <div className={styles.hubActions}>
          <Link href={SIGN_UP_PATH} className={`ui-button-2 primary ${styles.hubButton}`}>
            Create account
          </Link>
          <Link href={SIGN_IN_LOGIN_PATH} className={`ui-button-2 ${styles.hubButton} ${styles.hubButtonOutline}`}>
            Sign in
          </Link>
        </div>
        <p className={styles.note}>Standard plan signup, waitlist, and workspace access all start here.</p>
        <Link href="/" className={styles.back}>
          ← Back to home
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authShell}>
      <div className={styles.page}>
      <span className={styles.eyebrow}>KDInsight</span>
      <h1 className={styles.title} id="sign-in-form-heading">
        Sign in
      </h1>
      <p className={styles.subtitle}>Enter your business credentials. Clients and administrators use this same form.</p>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="on" noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-in-email">
            Email
          </label>
          <input
            id="sign-in-email"
            className={styles.input}
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="you@yourbusiness.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sign-in-password">
            Password
          </label>
          <div className={styles.passwordRow}>
            <input
              id="sign-in-password"
              className={styles.input}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              aria-describedby={process.env.NODE_ENV === 'development' ? 'sign-in-dev-hint' : undefined}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        {process.env.NODE_ENV === 'development' ? (
          <p id="sign-in-dev-hint" className={styles.hint}>
            Local dev: add <code className={styles.code}>SEED_USER_EMAIL</code> and{' '}
            <code className={styles.code}>SEED_USER_PASSWORD</code> to <code className={styles.code}>.env.local</code>
            , then run <code className={styles.code}>npm run db:seed</code> after migrations.
          </p>
        ) : null}
        <div className={styles.actions}>
          <button type="submit" className={`ui-button-2 primary ${styles.submit}`}>
            Sign in
          </button>
        </div>
      </form>
      <p className={styles.note}>
        Need an account?{' '}
        <Link href={SIGN_UP_PATH} className={styles.inlineLink}>
          Register
        </Link>
        {' · '}
        <Link href={SIGN_IN_HUB_PATH} className={styles.inlineLink}>
          Account options
        </Link>
      </p>
      <Link href="/" className={styles.back}>
        ← Back to home
      </Link>
      </div>
    </div>
  );
};

export default SignIn;
