'use client';

import { useEffect, useState } from 'react';
import { formatKes } from 'lib/demoCatalog';
import styles from './DashboardOverview.module.scss';

const activity = [
  {
    title: 'Stock adjustment approved; SKU MG-204',
    meta: 'Westlands · Manager Njeri',
    time: '32m ago',
  },
  {
    title: 'New branch user invited (Cashier)',
    meta: 'Kisumu Central',
    time: '1h ago',
  },
  {
    title: 'Daily sales report sent',
    meta: 'Email · WhatsApp',
    time: '6:02 AM',
  },
  {
    title: 'Paystack subscription renewed',
    meta: 'Standard plan · 3 branches',
    time: 'Yesterday',
  },
];

type DemoOrder = {
  id: string;
  clientEmail: string;
  totalCents: number;
  status: 'PENDING' | 'PLACED';
  createdAt: string;
  items: Array<{ title: string; quantity: number; unitCents: number }>;
};

type DashboardStats = {
  totalOrders: number;
  todaysOrders: number;
  totalRevenueCents: number;
  totalUsers: number;
  clientUsers: number;
  adminUsers: number;
  activeUseCases: number;
  trend: Array<{ date: string; count: number; totalCents: number }>;
};

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DashboardOverview = () => {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [ordersState, setOrdersState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [statsState, setStatsState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return toYmd(d);
  });
  const [rangeEnd, setRangeEnd] = useState(() => toYmd(new Date()));

  useEffect(() => {
    const load = async () => {
      setOrdersState('loading');
      setStatsState('loading');
      try {
        const [ordersRes, statsRes] = await Promise.all([
          fetch('/api/admin/demo-orders', { credentials: 'include' }),
          fetch(`/api/admin/dashboard-stats?start=${rangeStart}&end=${rangeEnd}`, { credentials: 'include' }),
        ]);
        if (!ordersRes.ok || !statsRes.ok) {
          throw new Error('failed');
        }
        const ordersJson = (await ordersRes.json()) as { orders?: DemoOrder[] };
        const statsJson = (await statsRes.json()) as DashboardStats;
        setOrders(ordersJson.orders || []);
        setStats(statsJson);
        setOrdersState('ready');
        setStatsState('ready');
      } catch {
        setOrdersState('error');
        setStatsState('error');
      }
    };
    void load();
  }, [rangeEnd, rangeStart]);

  return (
    <>
      <div className={styles.stats}>
        {[
          {
            label: 'Total demo orders',
            value: stats ? `${stats.totalOrders}` : '—',
            delta: stats ? `${stats.todaysOrders} today` : 'Loading…',
            trend: 'up' as const,
          },
          {
            label: 'Order value',
            value: stats ? formatKes(stats.totalRevenueCents) : '—',
            delta: 'All submitted demo orders',
            trend: 'up' as const,
          },
          {
            label: 'Active use cases',
            value: stats ? `${stats.activeUseCases}` : '—',
            delta: 'Visible in client marketplace',
            trend: 'down' as const,
          },
          {
            label: 'Workspace users',
            value: stats ? `${stats.totalUsers}` : '—',
            delta: stats ? `${stats.clientUsers} clients · ${stats.adminUsers} admins` : 'Loading…',
            trend: 'down' as const,
          },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <p className={`${styles.statDelta} ${s.trend === 'up' ? styles.up : styles.down}`}>{s.delta}</p>
          </div>
        ))}
      </div>
      {statsState === 'error' ? <p className={styles.panelSub}>Could not load current dashboard statistics.</p> : null}

      <div className={styles.grid2}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>Order trend</h2>
              <p className={styles.panelSub}>Daily demo requests in selected date range</p>
            </div>
          </div>
          <div className={styles.rangeControls}>
            <label className={styles.rangeField}>
              <span>Start</span>
              <input
                type="date"
                value={rangeStart}
                max={rangeEnd}
                onChange={(e) => setRangeStart(e.target.value)}
              />
            </label>
            <label className={styles.rangeField}>
              <span>End</span>
              <input
                type="date"
                value={rangeEnd}
                min={rangeStart}
                onChange={(e) => setRangeEnd(e.target.value)}
              />
            </label>
          </div>
          {statsState === 'loading' ? <p className={styles.panelSub}>Loading chart…</p> : null}
          {statsState === 'ready' && stats?.trend?.length ? (
            <>
              <div className={styles.chart} role="img" aria-label="Bar chart of daily order count">
                {stats.trend.map((bar) => {
                  const maxCount = Math.max(...stats.trend.map((t) => t.count), 1);
                  const height = Math.max(14, Math.round((bar.count / maxCount) * 150));
                  return (
                    <div
                      key={bar.date}
                      className={styles.chartBar}
                      style={{ height }}
                      title={`${bar.date}: ${bar.count} order(s), ${formatKes(bar.totalCents)}`}
                    />
                  );
                })}
              </div>
              <div className={styles.chartLabels}>
                {stats.trend.map((bar) => (
                  <span key={bar.date} className={styles.chartLabel}>
                    {new Date(bar.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>Activity</h2>
              <p className={styles.panelSub}>Recent workspace events</p>
            </div>
          </div>
          <ul className={styles.list}>
            {activity.map((item) => (
              <li key={item.title} className={styles.listItem}>
                <span className={styles.listDot} aria-hidden />
                <div className={styles.listBody}>
                  <p className={styles.listTitle}>{item.title}</p>
                  <p className={styles.listMeta}>{item.meta}</p>
                </div>
                <span className={styles.listTime}>{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h2 className={styles.panelTitle}>Recent demo orders</h2>
            <p className={styles.panelSub}>Latest client-submitted demo requests</p>
          </div>
        </div>
        {ordersState === 'loading' ? <p className={styles.panelSub}>Loading recent orders…</p> : null}
        {ordersState === 'error' ? <p className={styles.panelSub}>Could not load recent orders.</p> : null}
        {ordersState === 'ready' && orders.length === 0 ? <p className={styles.panelSub}>No orders yet.</p> : null}
        {ordersState === 'ready' && orders.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Client</th>
                  <th scope="col">Use cases</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Time</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.clientEmail}</td>
                    <td>
                      {order.items
                        .slice(0, 2)
                        .map((item) => `${item.quantity}x ${item.title}`)
                        .join(' · ')}
                      {order.items.length > 2 ? ' ...' : ''}
                    </td>
                    <td className={styles.amount}>{formatKes(order.totalCents)}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`${styles.status} ${order.status === 'PLACED' ? styles.paid : styles.pending}`}>
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DashboardOverview;
