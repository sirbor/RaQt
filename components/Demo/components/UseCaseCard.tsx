import React from 'react';
import styles from '../DemoCatalog.module.scss';
import { formatKes } from 'lib/demoCatalog';

type UseCaseItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  priceCents: number;
  inCartQuantity: number;
};

const CATEGORY_EMOJI: Record<string, string> = {
  Retail: '🛍️',
  'F&B': '🍽️',
  Hospitality: '🏨',
  Property: '🏢',
  Services: '💆',
  Distribution: '📦',
  SaaS: '🌐',
  Infrastructure: '🤖',
  'Enterprise Retail': '🏬',
};

type UseCaseCardProps = {
  item: UseCaseItem;
  onAdd: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onDecrease: (id: string, qty: number) => void;
};

const UseCaseCard = ({ item, onAdd, onRemove, onDecrease }: UseCaseCardProps) => {
  const summaryLines = item.summary.split('\n');
  const mainSummary = summaryLines[0];
  const highlights = summaryLines.slice(1);

  return (
    <article className={styles.card}>
      <p className={styles.category}>
        <span>{CATEGORY_EMOJI[item.category] ?? '✨'}</span> {item.category}
      </p>
      <h2 className={styles.cardTitle}>{item.title}</h2>
      <p className={styles.cardSummary}>{mainSummary}</p>
      <ul className={styles.highlights}>
        {highlights.map((point) => (
          <li key={`${item.id}-${point}`}>{point}</li>
        ))}
      </ul>
      <div className={styles.cardFooterContainer}>
        <p className={styles.price}>{formatKes(item.priceCents)}</p>
        <div className={styles.cardFooter}>
          {item.inCartQuantity > 0 ? (
            <div className={styles.quantityControl}>
              <button
                type="button"
                className={styles.miniBtn}
                onClick={() => (item.inCartQuantity > 1 ? onDecrease(item.id, item.inCartQuantity - 1) : onRemove(item.id))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className={styles.inCartBadge}>{item.inCartQuantity}</span>
              <button
                type="button"
                className={styles.miniBtn}
                onClick={() => onAdd(item.id, item.inCartQuantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button type="button" className={styles.addBtn} onClick={() => onAdd(item.id, 1)}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default UseCaseCard;
