'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import styles from './DemoManagement.module.scss';
import { formatKes } from 'lib/demoCatalog';

type UseCase = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  priceCents: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
};

const DemoManagement = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<UseCase | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch('/api/admin/use-cases', { credentials: 'include' });
      if (!r.ok) {
        setError('Could not load use cases.');
        return;
      }
      const j = (await r.json()) as { useCases: UseCase[] };
      setUseCases(j.useCases ?? []);
    } catch {
      setError('Could not load use cases.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      id: editing?.id,
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      priceCents: Math.round(parseFloat(formData.get('price') as string) * 100),
      summary: formData.get('summary') as string,
      sortOrder: parseInt(formData.get('sortOrder') as string, 10),
      isActive: formData.get('isActive') === 'on',
    };

    if (!data.title || !data.summary || isNaN(data.priceCents) || !data.category) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const r = await fetch('/api/admin/use-cases', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!r.ok) {
        setFormError('Could not save use case.');
        return;
      }

      const j = await r.json();
      setSuccessMsg(editing ? 'Use case updated.' : 'Use case created.');
      setEditing(null);
      form.reset();
      void load();
    } catch {
      setFormError('Network error.');
    }
  };

  const onEdit = (uc: UseCase) => {
    setEditing(uc);
    setFormError(null);
    setSuccessMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this use case?')) return;
    
    try {
      const r = await fetch(`/api/admin/use-cases?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (r.ok) {
        void load();
      } else {
        alert('Could not delete use case.');
      }
    } catch {
      alert('Network error.');
    }
  };

  const onCancelEdit = () => {
    setEditing(null);
    setFormError(null);
  };

  if (loading) {
    return <p className={styles.muted}>Loading use cases…</p>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>{editing ? 'Edit Use Case' : 'Add Use Case'}</h2>
        <p className={styles.lead}>
          Define a new capability for the demo marketplace. Slugs are auto-generated from titles.
        </p>
        <form className={styles.form} onSubmit={onSave} key={editing?.id || 'new'}>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="uc-title">Title</label>
            <input 
              id="uc-title" 
              className={styles.input} 
              name="title" 
              type="text" 
              defaultValue={editing?.title} 
              required 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="uc-category">Category</label>
              <input 
                id="uc-category" 
                className={styles.input} 
                name="category" 
                type="text" 
                defaultValue={editing?.category} 
                placeholder="e.g. Retail" 
                required 
              />
            </div>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="uc-price">Price (KES)</label>
              <input 
                id="uc-price" 
                className={styles.input} 
                name="price" 
                type="number" 
                step="0.01" 
                defaultValue={editing ? editing.priceCents / 100 : ''} 
                required 
              />
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="uc-summary">Summary & Highlights (one per line)</label>
            <textarea 
              id="uc-summary" 
              className={styles.textarea} 
              name="summary" 
              defaultValue={editing?.summary} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="uc-sort">Sort Order</label>
              <input 
                id="uc-sort" 
                className={styles.input} 
                name="sortOrder" 
                type="number" 
                defaultValue={editing?.sortOrder || 0} 
              />
            </div>
            <label className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={editing ? editing.isActive : true} 
              />
              Visible in marketplace
            </label>
          </div>

          {formError ? <p className={styles.error} role="alert">{formError}</p> : null}
          {successMsg ? <p className={styles.success} role="status">{successMsg}</p> : null}
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="ui-button-2 primary">
              {editing ? 'Update Use Case' : 'Create Use Case'}
            </button>
            {editing && (
              <button type="button" className="ui-button-2" onClick={onCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Marketplace Catalog</h2>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Order</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {useCases.map((uc) => (
                <tr key={uc.id}>
                  <td><strong>{uc.title}</strong></td>
                  <td>{uc.category}</td>
                  <td>{formatKes(uc.priceCents)}</td>
                  <td>{uc.sortOrder}</td>
                  <td>
                    <span className={uc.isActive ? styles.badgeActive : styles.badgeInactive}>
                      {uc.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => onEdit(uc)}>Edit</button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => onDelete(uc.id)}>Delete</button>
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

export default DemoManagement;
