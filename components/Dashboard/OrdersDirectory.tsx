'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatKes } from 'lib/demoCatalog';
import { SIGN_IN_LOGIN_PATH } from 'lib/authEntry';
import styles from './OrdersDirectory.module.scss';

type OrderRow = {
  id: string;
  clientEmail: string;
  totalCents: number;
  status: 'PENDING' | 'PLACED';
  createdAt: string;
  notes: string | null;
  items: Array<{ title: string; quantity: number; unitCents: number }>;
};

const OrdersDirectory = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const r = await fetch('/api/admin/demo-orders?limit=all', { credentials: 'include' });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string; message?: string };
        if (r.status === 401) {
          setError('Your admin session expired. Sign in again to view orders.');
          window.location.assign(SIGN_IN_LOGIN_PATH);
          return;
        }
        throw new Error(j.message || j.error || `Request failed (${r.status})`);
      }
      const j = (await r.json()) as { orders?: OrderRow[] };
      setOrders(j.orders || []);
      setState('ready');
    } catch {
      setError('Could not load orders. Check admin session and database connectivity.');
      setState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>All demo orders</h2>
        <button type="button" className={styles.refreshBtn} onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <p className={styles.lead}>Complete order log for all client demo requests.</p>

      {state === 'loading' ? <p className={styles.muted}>Loading orders…</p> : null}
      {state === 'error' ? <p className={styles.error}>{error || 'Could not load orders.'}</p> : null}
      {state === 'ready' && !orders.length ? <p className={styles.muted}>No orders found.</p> : null}

      {state === 'ready' && orders.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Client</th>
                <th scope="col">Use cases</th>
                <th scope="col">Total</th>
                <th scope="col">Notes</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.reference}>{order.id}</td>
                  <td>{order.clientEmail}</td>
                  <td>
                    {order.items.map((item) => `${item.quantity}x ${item.title}`).join(' · ')}
                  </td>
                  <td className={styles.amount}>{formatKes(order.totalCents)}</td>
                  <td className={styles.notes}>{order.notes?.trim() ? order.notes : '—'}</td>
                  <td>
                    <span className={order.status === 'PLACED' ? styles.badgePlaced : styles.badgePending}>
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td className={styles.date}>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default OrdersDirectory;
