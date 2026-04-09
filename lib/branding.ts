/** Site name for copy, metadata, and the `<Wordmark />` component */
export const SITE_NAME = 'KDInsight';

/**
 * @deprecated The UI uses the text wordmark (`components/Wordmark`). Kept only if something
 * still expects a logo asset path.
 */
export const LOGO_URL = '/logo.png';

/** @deprecated Image logo removed from the app shell */
export function logoUrl(_variant?: 'black' | 'white'): string {
  return LOGO_URL;
}

/** @deprecated Image logo removed from the app shell */
export const LOGO_NAV_WIDTH = 120;

/** @deprecated Image logo removed from the app shell */
export const LOGO_NAV_HEIGHT = 60;
