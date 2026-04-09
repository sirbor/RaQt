import Head from 'next/head';
import type { NextPage } from 'next';
import AuthGate from 'components/Dashboard/AuthGate';
import DashboardShell from 'components/Dashboard/DashboardShell';
import DashboardOverview from 'components/Dashboard/DashboardOverview';

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard · KDInsight</title>
        <meta
          name="description"
          content="KDInsight admin dashboard: sales, inventory, branches, and workspace activity."
        />
      </Head>
      <AuthGate>
        <DashboardShell activeNav="overview">
          <DashboardOverview />
        </DashboardShell>
      </AuthGate>
    </>
  );
};

export default DashboardPage;
