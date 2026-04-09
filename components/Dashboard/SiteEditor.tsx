'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  clearHomepageContentStorage,
  dispatchHomepageUpdated,
  getDefaultHomepageContent,
  loadHomepageContentFromStorage,
  normalizeHomepageContent,
  saveHomepageContentToStorage,
  type HomepageContent,
} from 'lib/homepageContent';
import styles from './SiteEditor.module.scss';

const SiteEditor = () => {
  const [draft, setDraft] = useState<HomepageContent>(() => getDefaultHomepageContent());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadHint, setLoadHint] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const r = await fetch('/api/homepage');
        if (r.ok) {
          const data = (await r.json()) as { content?: HomepageContent; source?: string; warning?: string };
          if (data.content) {
            setDraft(normalizeHomepageContent(data.content));
            if (data.warning === 'database_unavailable') {
              setLoadHint('Database unreachable; showing defaults. Check DATABASE_URL.');
            } else if (data.source === 'database') {
              setLoadHint('Loaded from PostgreSQL.');
            }
            return;
          }
        }
      } catch {
        /* fallback */
      }
      const raw = loadHomepageContentFromStorage();
      setDraft(normalizeHomepageContent(raw ?? {}));
      setLoadHint('Using browser cache or defaults (API unavailable).');
    })();
  }, []);

  const save = useCallback(async () => {
    setSaveError(null);
    const normalized = normalizeHomepageContent(draft);
    try {
      const r = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(normalized),
      });
      if (r.status === 401) {
        setSaveError('Not authorized. Sign out and sign in again to refresh your admin cookie.');
        return;
      }
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { message?: string; error?: string };
        setSaveError(j.message || j.error || `Save failed (${r.status}).`);
        return;
      }
      saveHomepageContentToStorage(normalized);
      setDraft(normalized);
      setSavedAt(Date.now());
      setLoadHint('Saved to PostgreSQL.');
      dispatchHomepageUpdated();
    } catch (e) {
      setSaveError(String(e));
    }
  }, [draft]);

  const reset = useCallback(async () => {
    setSaveError(null);
    clearHomepageContentStorage();
    const d = getDefaultHomepageContent();
    setDraft(d);
    setSavedAt(null);
    try {
      const r = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(d),
      });
      if (r.ok) {
        setLoadHint('Reset saved to PostgreSQL.');
        saveHomepageContentToStorage(d);
      } else {
        setLoadHint('Reset locally; database not updated (sign in or check connection).');
      }
    } catch {
      setLoadHint('Reset locally; could not reach API.');
    }
    dispatchHomepageUpdated();
  }, []);

  const updateHero = (patch: Partial<HomepageContent['hero']>) => {
    setDraft((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
  };

  const updateHighlights = (patch: Partial<HomepageContent['highlights']>) => {
    setDraft((d) => ({ ...d, highlights: { ...d.highlights, ...patch } }));
  };

  const updateHighlightItem = (index: number, patch: Partial<HomepageContent['highlights']['items'][0]>) => {
    setDraft((d) => {
      const items = [...d.highlights.items];
      items[index] = { ...items[index], ...patch };
      return { ...d, highlights: { ...d.highlights, items } };
    });
  };

  const updateUseCases = (patch: Partial<HomepageContent['useCases']>) => {
    setDraft((d) => ({ ...d, useCases: { ...d.useCases, ...patch } }));
  };

  const updateUseCase = (index: number, patch: Partial<HomepageContent['useCases']['cases'][0]>) => {
    setDraft((d) => {
      const cases = [...d.useCases.cases];
      cases[index] = { ...cases[index], ...patch };
      return { ...d, useCases: { ...d.useCases, cases } };
    });
  };

  const updateUseCaseFeatures = (index: number, text: string) => {
    const features = text.split('\n').map((s) => s.trim()).filter(Boolean);
    setDraft((d) => {
      const cases = [...d.useCases.cases];
      cases[index] = { ...cases[index], features };
      return { ...d, useCases: { ...d.useCases, cases } };
    });
  };

  const updatePricing = (patch: Partial<HomepageContent['pricing']>) => {
    setDraft((d) => ({ ...d, pricing: { ...d.pricing, ...patch } }));
  };

  const updatePricingStd = (patch: Partial<HomepageContent['pricing']['standard']>) => {
    setDraft((d) => ({
      ...d,
      pricing: { ...d.pricing, standard: { ...d.pricing.standard, ...patch } },
    }));
  };

  const updatePricingPlus = (patch: Partial<HomepageContent['pricing']['plus']>) => {
    setDraft((d) => ({
      ...d,
      pricing: { ...d.pricing, plus: { ...d.pricing.plus, ...patch } },
    }));
  };

  const updateCta = (patch: Partial<HomepageContent['cta']>) => {
    setDraft((d) => ({ ...d, cta: { ...d.cta, ...patch } }));
  };

  return (
    <div className={styles.wrapper}>
      {loadHint ? <p className={styles.loadHint}>{loadHint}</p> : null}
      {saveError ? (
        <p className={styles.saveError} role="alert">
          {saveError}
        </p>
      ) : null}
      <div className={styles.toolbar}>
        <button type="button" className="ui-button-2 primary" onClick={() => void save()}>
          Save homepage
        </button>
        <button type="button" className={styles.btnGhost} onClick={() => void reset()}>
          Reset to defaults
        </button>
        <Link href="/" className="ui-button-2 primary" target="_blank" rel="noopener noreferrer">
          Open home
        </Link>
        {savedAt ? (
          <p className={styles.saved} role="status">
            Saved {new Date(savedAt).toLocaleTimeString()}
          </p>
        ) : null}
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Hero</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="hero-eyebrow">
            Eyebrow
          </label>
          <input
            id="hero-eyebrow"
            className={styles.input}
            value={draft.hero.eyebrow}
            onChange={(e) => updateHero({ eyebrow: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="hero-title">
            Title
          </label>
          <input
            id="hero-title"
            className={styles.input}
            value={draft.hero.title}
            onChange={(e) => updateHero({ title: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="hero-lead1">
            Lead paragraph 1
          </label>
          <textarea
            id="hero-lead1"
            className={styles.textarea}
            rows={3}
            value={draft.hero.lead1}
            onChange={(e) => updateHero({ lead1: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="hero-lead2">
            Lead paragraph 2
          </label>
          <textarea
            id="hero-lead2"
            className={styles.textarea}
            rows={3}
            value={draft.hero.lead2}
            onChange={(e) => updateHero({ lead2: e.target.value })}
          />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="hero-pcta">
              Primary CTA
            </label>
            <input
              id="hero-pcta"
              className={styles.input}
              value={draft.hero.primaryCta}
              onChange={(e) => updateHero({ primaryCta: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="hero-scta">
              Secondary CTA
            </label>
            <input
              id="hero-scta"
              className={styles.input}
              value={draft.hero.secondaryCta}
              onChange={(e) => updateHero({ secondaryCta: e.target.value })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Solutions (highlights grid)</legend>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="hl-eyebrow">
              Eyebrow
            </label>
            <input
              id="hl-eyebrow"
              className={styles.input}
              value={draft.highlights.eyebrow}
              onChange={(e) => updateHighlights({ eyebrow: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="hl-title">
              Section title
            </label>
            <input
              id="hl-title"
              className={styles.input}
              value={draft.highlights.title}
              onChange={(e) => updateHighlights({ title: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="hl-intro">
            Intro
          </label>
          <textarea
            id="hl-intro"
            className={styles.textarea}
            rows={2}
            value={draft.highlights.intro}
            onChange={(e) => updateHighlights({ intro: e.target.value })}
          />
        </div>
        <p className={styles.hint}>
          Thirteen cards: nine operational features (fixed icon order), then four strategic infrastructure pillars.
        </p>
        {draft.highlights.items.map((item, i) => (
          <div key={i} className={styles.cardEditor}>
            <span className={styles.label}>Card {i + 1}</span>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`hl-t-${i}`}>
                Title
              </label>
              <input
                id={`hl-t-${i}`}
                className={styles.input}
                value={item.title}
                onChange={(e) => updateHighlightItem(i, { title: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`hl-b-${i}`}>
                Body
              </label>
              <textarea
                id={`hl-b-${i}`}
                className={styles.textarea}
                rows={2}
                value={item.body}
                onChange={(e) => updateHighlightItem(i, { body: e.target.value })}
              />
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Use cases</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="uc-eyebrow">
            Eyebrow
          </label>
          <input
            id="uc-eyebrow"
            className={styles.input}
            value={draft.useCases.eyebrow}
            onChange={(e) => updateUseCases({ eyebrow: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="uc-title">
            Title
          </label>
          <input
            id="uc-title"
            className={styles.input}
            value={draft.useCases.title}
            onChange={(e) => updateUseCases({ title: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="uc-lead">
            Lead
          </label>
          <textarea
            id="uc-lead"
            className={styles.textarea}
            rows={2}
            value={draft.useCases.lead}
            onChange={(e) => updateUseCases({ lead: e.target.value })}
          />
        </div>
        <p className={styles.hint}>
          Nine industry and segment cards: six classic verticals plus SaaS exporters, unmanned IoT commerce, and modern
          regional retail networks.
        </p>
        {draft.useCases.cases.map((c, i) => (
          <div key={i} className={styles.cardEditor}>
            <span className={styles.label}>Industry {i + 1}</span>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`uc-e-${i}`}>
                  Emoji
                </label>
                <input
                  id={`uc-e-${i}`}
                  className={styles.input}
                  value={c.emoji}
                  onChange={(e) => updateUseCase(i, { emoji: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`uc-l-${i}`}>
                  Label
                </label>
                <input
                  id={`uc-l-${i}`}
                  className={styles.input}
                  value={c.label}
                  onChange={(e) => updateUseCase(i, { label: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`uc-d-${i}`}>
                Description
              </label>
              <textarea
                id={`uc-d-${i}`}
                className={styles.textarea}
                rows={2}
                value={c.detail}
                onChange={(e) => updateUseCase(i, { detail: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`uc-f-${i}`}>
                Features (one per line)
              </label>
              <textarea
                id={`uc-f-${i}`}
                className={styles.textarea}
                rows={4}
                value={c.features.join('\n')}
                onChange={(e) => updateUseCaseFeatures(i, e.target.value)}
              />
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Pricing</legend>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pr-eyebrow">
              Eyebrow
            </label>
            <input
              id="pr-eyebrow"
              className={styles.input}
              value={draft.pricing.eyebrow}
              onChange={(e) => updatePricing({ eyebrow: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pr-title">
              Title
            </label>
            <input
              id="pr-title"
              className={styles.input}
              value={draft.pricing.title}
              onChange={(e) => updatePricing({ title: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pr-lead">
            Lead
          </label>
          <textarea
            id="pr-lead"
            className={styles.textarea}
            rows={2}
            value={draft.pricing.lead}
            onChange={(e) => updatePricing({ lead: e.target.value })}
          />
        </div>
        <h3 className={styles.subHead}>Standard plan</h3>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="std-ribbon">
              Ribbon
            </label>
            <input
              id="std-ribbon"
              className={styles.input}
              value={draft.pricing.standard.ribbon}
              onChange={(e) => updatePricingStd({ ribbon: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="std-name">
              Name
            </label>
            <input
              id="std-name"
              className={styles.input}
              value={draft.pricing.standard.name}
              onChange={(e) => updatePricingStd({ name: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="std-price">
              Price line
            </label>
            <input
              id="std-price"
              className={styles.input}
              value={draft.pricing.standard.price}
              onChange={(e) => updatePricingStd({ price: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="std-per">
              Per suffix
            </label>
            <input
              id="std-per"
              className={styles.input}
              value={draft.pricing.standard.per}
              onChange={(e) => updatePricingStd({ per: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="std-feat">
            Features (one per line)
          </label>
          <textarea
            id="std-feat"
            className={styles.textarea}
            rows={6}
            value={draft.pricing.standard.features.join('\n')}
            onChange={(e) =>
              updatePricingStd({
                features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="std-cta">
            Button label
          </label>
          <input
            id="std-cta"
            className={styles.input}
            value={draft.pricing.standard.cta}
            onChange={(e) => updatePricingStd({ cta: e.target.value })}
          />
        </div>
        <h3 className={styles.subHead}>KD Insight Plus</h3>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pl-ribbon">
              Ribbon
            </label>
            <input
              id="pl-ribbon"
              className={styles.input}
              value={draft.pricing.plus.ribbon}
              onChange={(e) => updatePricingPlus({ ribbon: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pl-name">
              Name
            </label>
            <input
              id="pl-name"
              className={styles.input}
              value={draft.pricing.plus.name}
              onChange={(e) => updatePricingPlus({ name: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pl-price">
              Price line
            </label>
            <input
              id="pl-price"
              className={styles.input}
              value={draft.pricing.plus.price}
              onChange={(e) => updatePricingPlus({ price: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pl-per">
              Per suffix
            </label>
            <input
              id="pl-per"
              className={styles.input}
              value={draft.pricing.plus.per}
              onChange={(e) => updatePricingPlus({ per: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pl-feat">
            Features (one per line)
          </label>
          <textarea
            id="pl-feat"
            className={styles.textarea}
            rows={5}
            value={draft.pricing.plus.features.join('\n')}
            onChange={(e) =>
              updatePricingPlus({
                features: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pl-cta">
            Button label
          </label>
          <input
            id="pl-cta"
            className={styles.input}
            value={draft.pricing.plus.cta}
            onChange={(e) => updatePricingPlus({ cta: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pl-note">
            Footnote
          </label>
          <textarea
            id="pl-note"
            className={styles.textarea}
            rows={2}
            value={draft.pricing.plus.note}
            onChange={(e) => updatePricingPlus({ note: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pr-ex-title">
            Examples card title
          </label>
          <input
            id="pr-ex-title"
            className={styles.input}
            value={draft.pricing.examplesTitle}
            onChange={(e) => updatePricing({ examplesTitle: e.target.value })}
          />
        </div>
        {draft.pricing.examples.map((ex, i) => (
          <div key={i} className={styles.cardEditor}>
            <span className={styles.label}>Example row {i + 1}</span>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`ex-l-${i}`}>
                  Label
                </label>
                <input
                  id={`ex-l-${i}`}
                  className={styles.input}
                  value={ex.label}
                  onChange={(e) => {
                    setDraft((d) => {
                      const examples = [...d.pricing.examples];
                      examples[i] = { ...examples[i], label: e.target.value };
                      return { ...d, pricing: { ...d.pricing, examples } };
                    });
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`ex-a-${i}`}>
                  Amount
                </label>
                <input
                  id={`ex-a-${i}`}
                  className={styles.input}
                  value={ex.amount}
                  onChange={(e) => {
                    setDraft((d) => {
                      const examples = [...d.pricing.examples];
                      examples[i] = { ...examples[i], amount: e.target.value };
                      return { ...d, pricing: { ...d.pricing, examples } };
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pay-title">
            Paystack heading
          </label>
          <input
            id="pay-title"
            className={styles.input}
            value={draft.pricing.paystackTitle}
            onChange={(e) => updatePricing({ paystackTitle: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pay-copy">
            Paystack body
          </label>
          <textarea
            id="pay-copy"
            className={styles.textarea}
            rows={2}
            value={draft.pricing.paystackCopy}
            onChange={(e) => updatePricing({ paystackCopy: e.target.value })}
          />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Closing CTA</legend>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cta-eyebrow">
            Eyebrow
          </label>
          <input
            id="cta-eyebrow"
            className={styles.input}
            value={draft.cta.eyebrow}
            onChange={(e) => updateCta({ eyebrow: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cta-title">
            Title
          </label>
          <input
            id="cta-title"
            className={styles.input}
            value={draft.cta.title}
            onChange={(e) => updateCta({ title: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cta-lead">
            Lead
          </label>
          <textarea
            id="cta-lead"
            className={styles.textarea}
            rows={2}
            value={draft.cta.lead}
            onChange={(e) => updateCta({ lead: e.target.value })}
          />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cta-p">
              Primary CTA
            </label>
            <input
              id="cta-p"
              className={styles.input}
              value={draft.cta.primaryCta}
              onChange={(e) => updateCta({ primaryCta: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cta-s">
              Secondary CTA
            </label>
            <input
              id="cta-s"
              className={styles.input}
              value={draft.cta.secondaryCta}
              onChange={(e) => updateCta({ secondaryCta: e.target.value })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default SiteEditor;
