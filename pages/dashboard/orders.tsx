import Head from 'next/head';
import type { NextPage } from 'next';
import AdminOnlyGate from 'components/Dashboard/AdminOnlyGate';
import AuthGate from 'components/Dashboard/AuthGate';
import DashboardShell from 'components/Dashboard/DashboardShell';
import OrdersDirectory from 'components/Dashboard/OrdersDirectory';

const OrdersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Orders · KDInsight</title>
        <meta name="description" content="View all client demo orders submitted in KDInsight." />
      </Head>
      <AuthGate>
        <AdminOnlyGate>
          <DashboardShell activeNav="orders" pageEyebrow="Workspace" pageTitle="Orders">
            <OrdersDirectory />
          </DashboardShell>
        </AdminOnlyGate>
      </AuthGate>
    </>
  );
};

export default OrdersPage;
