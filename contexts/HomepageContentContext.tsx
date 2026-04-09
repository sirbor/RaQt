'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getDefaultHomepageContent,
  loadHomepageContentFromStorage,
  normalizeHomepageContent,
  type HomepageContent,
} from 'lib/homepageContent';

const HomepageContentContext = createContext<HomepageContent>(getDefaultHomepageContent());

export function HomepageContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HomepageContent>(() => getDefaultHomepageContent());

  const refresh = useCallback(() => {
    void (async () => {
      try {
        const r = await fetch('/api/homepage');
        if (r.ok) {
          const data = (await r.json()) as { content?: HomepageContent };
          if (data.content) {
            setContent(normalizeHomepageContent(data.content));
            return;
          }
        }
      } catch {
        /* fallback */
      }
      const raw = loadHomepageContentFromStorage();
      setContent(normalizeHomepageContent(raw ?? {}));
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener('kdinsight-homepage-updated', onUpdate);
    return () => window.removeEventListener('kdinsight-homepage-updated', onUpdate);
  }, [refresh]);

  const value = useMemo(() => content, [content]);

  return <HomepageContentContext.Provider value={value}>{children}</HomepageContentContext.Provider>;
}

export function useHomepageContent(): HomepageContent {
  return useContext(HomepageContentContext);
}
