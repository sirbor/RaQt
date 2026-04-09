'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SIGN_IN_LOGIN_PATH } from 'lib/authEntry';
import { clearUserSession, readUserSession } from 'lib/userSession';
import { formatKes } from 'lib/demoCatalog';
import styles from './DemoCatalog.module.scss';
import UseCaseCard from './components/UseCaseCard';
import DemoCart from './components/DemoCart';
import SkeletonCard from './components/SkeletonCard';
import Toast from '../Toast';

type UseCaseItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  priceCents: number;
  inCartQuantity: number;
};

type CartItem = {
  useCaseId: string;
  quantity: number;
  title: string;
  unitPriceCents: number;
  lineTotalCents: number;
};

type CartResponse = {
  items: CartItem[];
  subtotalCents: number;
  totalItems: number;
};

type CreatedOrder = {
  id: string;
  totalCents: number;
  createdAt: string;
  items: Array<{
    title: string;
    quantity: number;
    unitCents: number;
  }>;
};

const EMPTY_CART: CartResponse = {
  items: [],
  subtotalCents: 0,
  totalItems: 0,
};

const DemoCatalog = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [isBusy, setIsBusy] = useState(true);
  const [useCases, setUseCases] = useState<UseCaseItem[]>([]);
  const [cart, setCart] = useState<CartResponse>(EMPTY_CART);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<CreatedOrder | null>(null);
  const [toast, setToast] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: '',
    content: '',
  });

  const email = useMemo(() => {
    const session = typeof window !== 'undefined' ? readUserSession() : null;
    return session?.email || '';
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(useCases.map((item) => item.category))).sort();
    return ['All', ...list];
  }, [useCases]);

  const visibleUseCases = useMemo(
    () => useCases.filter((item) => activeCategory === 'All' || item.category === activeCategory),
    [activeCategory, useCases],
  );

  const showToast = (title: string, content: string) => {
    setToast({ open: true, title, content });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 4000);
  };

  const refreshCart = async () => {
    const cartRes = await fetch('/api/demo/cart', { credentials: 'include' });
    if (!cartRes.ok) throw new Error('Could not load cart.');
    const cartJson = (await cartRes.json()) as CartResponse;
    setCart(cartJson);
  };

  const refreshCatalog = async () => {
    const useCasesRes = await fetch('/api/demo/use-cases', { credentials: 'include' });
    if (!useCasesRes.ok) throw new Error('Could not load demo use cases.');
    const useCasesJson = (await useCasesRes.json()) as { useCases: UseCaseItem[] };
    setUseCases(useCasesJson.useCases);
  };

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      void router.replace(SIGN_IN_LOGIN_PATH);
      return;
    }
    if (session.role !== 'client') {
      void router.replace('/dashboard');
      return;
    }
    setAllowed(true);

    const run = async () => {
      setIsBusy(true);
      setStatus(null);
      try {
        await Promise.all([refreshCatalog(), refreshCart()]);
      } catch (e) {
        setStatus((e as Error).message);
      } finally {
        setIsBusy(false);
      }
    };
    void run();
  }, [router]);

  const syncAfterCartChange = async (cartJson: CartResponse, message?: string) => {
    setCart(cartJson);
    await refreshCatalog();
    if (message) showToast('Cart Updated', message);
  };

  const upsertCartItem = async (useCaseId: string, quantity: number) => {
    const res = await fetch('/api/demo/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ useCaseId, quantity }),
    });
    if (!res.ok) throw new Error('Could not update cart.');
    const cartJson = (await res.json()) as CartResponse;
    const item = useCases.find((u) => u.id === useCaseId);
    await syncAfterCartChange(cartJson, item ? `Quantity of ${item.title} updated to ${quantity}.` : undefined);
  };

  const removeCartItem = async (useCaseId: string) => {
    const res = await fetch('/api/demo/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ useCaseId }),
    });
    if (!res.ok) throw new Error('Could not remove cart item.');
    const cartJson = (await res.json()) as CartResponse;
    const item = useCases.find((u) => u.id === useCaseId);
    await syncAfterCartChange(cartJson, item ? `${item.title} removed from cart.` : undefined);
  };

  const placeOrder = async () => {
    setCheckoutPending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/demo/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes: note }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        order?: CreatedOrder;
      };
      if (!res.ok) {
        throw new Error(json.error === 'cart_empty' ? 'Your cart is empty.' : 'Could not place order.');
      }
      await Promise.all([refreshCatalog(), refreshCart()]);
      setNote('');
      setLastOrder(json.order || null);
      setConfirmOpen(false);
      showToast('Success', 'Your demo request has been submitted successfully.');
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setCheckoutPending(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      /* ignore */
    }
    clearUserSession();
    void router.replace(SIGN_IN_LOGIN_PATH);
  };

  if (!allowed) {
    return <div className={styles.loading}>Verifying session…</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>KDInsight Demo Marketplace</p>
          <h1 className={styles.title}>Explore Use Cases For Your Demo</h1>
          <p className={styles.subtitle}>
            Logged in as <strong>{email}</strong>. Select the capabilities you want to see in action.
          </p>
          <div className={styles.quickStats}>
            <span>{useCases.length} use cases available</span>
            <span>{cart.totalItems} item(s) in cart</span>
            <span>Total {formatKes(cart.subtotalCents)}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.linkBtn}>
            Homepage
          </Link>
          <button type="button" className={styles.ghostBtn} onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {status && (
        <div className={styles.status} role="alert">
          <span>⚠️</span> {status}
        </div>
      )}

      {lastOrder && (
        <section className={styles.confirmation}>
          <p className={styles.confirmationEyebrow}>Order Confirmed</p>
          <h2 className={styles.confirmationTitle}>Your demo request was submitted</h2>
          <p className={styles.confirmationMeta}>
            Reference <strong>{lastOrder.id}</strong> · {new Date(lastOrder.createdAt).toLocaleString()} · Total{' '}
            <strong>{formatKes(lastOrder.totalCents)}</strong>
          </p>
          <ul className={styles.confirmationItems}>
            {lastOrder.items.map((item) => (
              <li key={`${lastOrder.id}-${item.title}`}>
                {item.quantity}x {item.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <main className={styles.layout}>
        <div className={styles.catalog}>
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.filterChip} ${activeCategory === category ? styles.filterChipActive : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {isBusy
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : visibleUseCases.map((item) => (
                  <UseCaseCard
                    key={item.id}
                    item={item}
                    onAdd={upsertCartItem}
                    onRemove={removeCartItem}
                    onDecrease={upsertCartItem}
                  />
                ))}
          </div>
        </div>

        <DemoCart
          cart={cart}
          note={note}
          onNoteChange={setNote}
          onCheckout={() => setConfirmOpen(true)}
          onRemoveItem={removeCartItem}
          checkoutPending={checkoutPending}
          hasLastOrder={!!lastOrder}
        />
      </main>

      {confirmOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className={styles.modalCard}>
            <h3 id="confirm-title">Confirm Demo Order</h3>
            <p>
              You are about to submit <strong>{cart.totalItems}</strong> item(s) for a total of{' '}
              <strong>{formatKes(cart.subtotalCents)}</strong>.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setConfirmOpen(false)}>
                Go Back
              </button>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => void placeOrder()}
                disabled={checkoutPending}
              >
                {checkoutPending ? 'Submitting…' : 'Confirm & Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast open={toast.open} title={toast.title} content={toast.content} />
    </div>
  );
};

export default DemoCatalog;
