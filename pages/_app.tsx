import 'styles/app.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Playfair_Display } from 'next/font/google';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'styles/createEmotionCache';
import 'styles/fonts.scss';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>KDInsight · Commerce infrastructure for East African SMEs and hybrid operators</title>
        <meta
          name="description"
          content="KDInsight unifies sales, inventory, staff, M-Pesa and Airtel Money, subscriptions, and multi branch control for SMEs. Commerce infrastructure for the hybrid economy, from Kenya to global scale."
        />
      </Head>
      <div className={playfair.variable}>
        <Component {...pageProps} />
      </div>
    </CacheProvider>
  );
}

export default MyApp;
