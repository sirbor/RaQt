import Head from 'next/head';
import type { NextPage } from 'next';
import AdminOnlyGate from 'components/Dashboard/AdminOnlyGate';
import AuthGate from 'components/Dashboard/AuthGate';
import DashboardShell from 'components/Dashboard/DashboardShell';
import DemoManagement from 'components/Dashboard/DemoManagement';

const DemoAdminPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manage Demo · KDInsight</title>
        <meta name="description" content="Manage KDInsight demo marketplace use cases." />
      </Head>
      <AuthGate>
        <AdminOnlyGate>
          <DashboardShell activeNav="demo" pageEyebrow="Marketplace" pageTitle="Demo Use Cases">
            <DemoManagement />
          </DashboardShell>
        </AdminOnlyGate>
      </AuthGate>
    </>
  );
};

export default DemoAdminPage;
