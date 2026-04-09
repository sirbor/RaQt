import React from 'react';
import styles from '../DemoCatalog.module.scss';
import { formatKes } from 'lib/demoCatalog';

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

type DemoCartProps = {
  cart: CartResponse;
  note: string;
  onNoteChange: (val: string) => void;
  onCheckout: () => void;
  onRemoveItem: (id: string) => void;
  checkoutPending: boolean;
  hasLastOrder: boolean;
};

const DemoCart = ({
  cart,
  note,
  onNoteChange,
  onCheckout,
  onRemoveItem,
  checkoutPending,
  hasLastOrder,
}: DemoCartProps) => {
  return (
    <aside className={styles.cart}>
      <p className={styles.cartEyebrow}>Demo Checkout</p>
      <h2 className={styles.cartTitle}>Your cart</h2>
      <ol className={styles.process}>
        <li className={styles.processDone}>Pick use cases</li>
        <li className={cart.items.length ? styles.processDone : ''}>Review cart</li>
        <li className={hasLastOrder ? styles.processDone : ''}>Order confirmation</li>
      </ol>

      {cart.items.length ? (
        <ul className={styles.cartList}>
          {cart.items.map((item) => (
            <li key={item.useCaseId} className={styles.cartItem}>
              <div>
                <p className={styles.cartItemTitle}>{item.title}</p>
                <p className={styles.cartItemMeta}>
                  {item.quantity} x {formatKes(item.unitPriceCents)}
                </p>
              </div>
              <div className={styles.cartItemActions}>
                <strong>{formatKes(item.lineTotalCents)}</strong>
                <button type="button" onClick={() => onRemoveItem(item.useCaseId)} aria-label={`Remove ${item.title}`}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyCartContainer}>
          <p className={styles.empty}>No use cases in your cart yet.</p>
        </div>
      )}

      {cart.items.length > 0 && (
        <>
          <label className={styles.label} htmlFor="demo-notes">
            Notes for your demo request
          </label>
          <textarea
            id="demo-notes"
            className={styles.notes}
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Any priorities, branch count, timeline, or custom datasets to include."
            maxLength={500}
          />

          <div className={styles.totalRow}>
            <span>Grand total</span>
            <strong>{formatKes(cart.subtotalCents)}</strong>
          </div>
          <button
            type="button"
            className={styles.checkout}
            onClick={onCheckout}
            disabled={!cart.items.length || checkoutPending}
          >
            {checkoutPending ? 'Placing order…' : 'Continue to confirmation'}
          </button>
        </>
      )}
    </aside>
  );
};

export default DemoCart;
