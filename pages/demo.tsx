import Head from 'next/head';
import type { NextPage } from 'next';
import DemoCatalog from 'components/Demo/DemoCatalog';

const DemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Book Demo Use Cases · KDInsight</title>
        <meta
          name="description"
          content="Browse KDInsight use cases, add them to your cart, and place your demo order."
        />
      </Head>
      <DemoCatalog />
    </>
  );
};

export default DemoPage;
