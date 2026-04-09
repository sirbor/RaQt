import Head from 'next/head';
import type { NextPage } from 'next';
import AdminOnlyGate from 'components/Dashboard/AdminOnlyGate';
import AuthGate from 'components/Dashboard/AuthGate';
import DashboardShell from 'components/Dashboard/DashboardShell';
import UserDirectory from 'components/Dashboard/UserDirectory';

const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Users · KDInsight</title>
        <meta name="description" content="Manage KDInsight client and administrator accounts." />
      </Head>
      <AuthGate>
        <AdminOnlyGate>
          <DashboardShell activeNav="users" pageEyebrow="Workspace" pageTitle="Users">
            <UserDirectory />
          </DashboardShell>
        </AdminOnlyGate>
      </AuthGate>
    </>
  );
};

export default UsersPage;
