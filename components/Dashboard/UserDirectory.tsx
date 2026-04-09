'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import styles from './UserDirectory.module.scss';

type Row = { id: string; email: string; role: 'ADMIN' | 'CLIENT'; createdAt: string };

const UserDirectory = () => {
  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdMsg, setCreatedMsg] = useState<string | null>(null);
  const [adminCode, setAdminCode] = useState<string | null>(null);
  const [adminCodeInfo, setAdminCodeInfo] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch('/api/admin/users', { credentials: 'include' });
      if (!r.ok) {
        setError('Could not load users.');
        return;
      }
      const j = (await r.json()) as { users: Row[] };
      setUsers(j.users ?? []);
    } catch {
      setError('Could not load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateAdminCode = async () => {
    setFormError(null);
    setCreatedMsg(null);
    try {
      const r = await fetch('/api/admin/admin-setup-code', {
        method: 'POST',
        credentials: 'include',
      });
      const j = (await r.json().catch(() => ({}))) as { code?: string; expiresAt?: string; error?: string };
      if (!r.ok || !j.code || !j.expiresAt) {
        setFormError('Could not generate admin setup code.');
        return;
      }
      setAdminCode(j.code);
      setAdminCodeInfo(`Code expires ${new Date(j.expiresAt).toLocaleString()}.`);
    } catch {
      setFormError('Network error while generating admin setup code.');
    }
  };

  const changeRole = async (userId: string, role: 'ADMIN' | 'CLIENT') => {
    setBusyUserId(userId);
    setFormError(null);
    try {
      const r = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, role }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        if (j.error === 'cannot_update_self_role') {
          setFormError('You cannot change your own role.');
          return;
        }
        setFormError('Could not update user role.');
        return;
      }
      await load();
    } catch {
      setFormError('Network error while updating user role.');
    } finally {
      setBusyUserId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    setBusyUserId(userId);
    setFormError(null);
    try {
      const r = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        if (j.error === 'cannot_delete_self') {
          setFormError('You cannot delete your own account.');
          return;
        }
        setFormError('Could not delete user.');
        return;
      }
      await load();
    } catch {
      setFormError('Network error while deleting user.');
    } finally {
      setBusyUserId(null);
    }
  };

  const onCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setCreatedMsg(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement)?.value as
      | 'ADMIN'
      | 'CLIENT';

    if (!email || !password) {
      setFormError('Enter email and password.');
      return;
    }

    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string; user?: { email: string } };

      if (!r.ok) {
        if (j.error === 'email_taken') {
          setFormError('That email is already registered.');
        } else if (j.error === 'password_too_short') {
          setFormError('Password must be at least 8 characters.');
        } else {
          setFormError('Could not create user.');
        }
        return;
      }

      form.reset();
      setCreatedMsg(`Created ${j.user?.email ?? 'user'}. Share the password securely.`);
      void load();
    } catch {
      setFormError('Network error.');
    }
  };

  if (loading) {
    return <p className={styles.muted}>Loading users…</p>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Admin registration code</h2>
        <p className={styles.lead}>Generate a one-time code for creating a new administrator account.</p>
        <div className={styles.actionsRow}>
          <button type="button" className={`ui-button-2 primary ${styles.submit}`} onClick={() => void generateAdminCode()}>
            Generate code
          </button>
        </div>
        {adminCode ? (
          <div className={styles.codeBox}>
            <p className={styles.codeValue}>{adminCode}</p>
            <p className={styles.codeMeta}>{adminCodeInfo}</p>
          </div>
        ) : null}
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Invite user</h2>
        <p className={styles.lead}>
          Create a client or administrator account. Send them their password through a secure channel.
        </p>
        <form className={styles.form} onSubmit={onCreate}>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="new-email">
              Email
            </label>
            <input id="new-email" className={styles.input} name="email" type="email" required />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="new-password">
              Password
            </label>
            <input
              id="new-password"
              className={styles.input}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="new-role">
              Role
            </label>
            <select id="new-role" className={styles.select} name="role" defaultValue="CLIENT">
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          {formError ? (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          ) : null}
          {createdMsg ? (
            <p className={styles.success} role="status">
              {createdMsg}
            </p>
          ) : null}
          <button type="submit" className={`ui-button-2 primary ${styles.submit}`}>
            Create user
          </button>
        </form>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Accounts</h2>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    <span className={u.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeClient}>
                      {u.role === 'ADMIN' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <select
                        className={styles.select}
                        value={u.role}
                        onChange={(e) => void changeRole(u.id, e.target.value as 'ADMIN' | 'CLIENT')}
                        disabled={busyUserId === u.id}
                      >
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => void deleteUser(u.id)}
                        disabled={busyUserId === u.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDirectory;
