import type { NextPage } from 'next';
import MainLayout from 'components/Layouts/MainLayout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleMoveToId } from 'utils';
import { HomepageContentProvider } from 'contexts/HomepageContentContext';
import Hero from 'components/KDInsight/Hero';
import Highlights from 'components/KDInsight/Highlights';
import UseCases from 'components/KDInsight/UseCases';
import Pricing from 'components/KDInsight/Pricing';
import ClosingCTA from 'components/KDInsight/ClosingCTA';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (router.query.cta) {
        handleMoveToId('cta');
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [router.query]);

  return (
    <MainLayout
      navbarProps={{
        logoColor: 'black',
        home: true,
      }}>
      <HomepageContentProvider>
        <Hero />
        <Highlights />
        <UseCases />
        <Pricing />
        <ClosingCTA />
      </HomepageContentProvider>
    </MainLayout>
  );
};

export default Home;
