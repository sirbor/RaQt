import Head from 'next/head';
import type { NextPage } from 'next';
import AdminOnlyGate from 'components/Dashboard/AdminOnlyGate';
import AuthGate from 'components/Dashboard/AuthGate';
import DashboardShell from 'components/Dashboard/DashboardShell';
import SiteEditor from 'components/Dashboard/SiteEditor';

const SiteEditorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Edit home page · KDInsight</title>
        <meta name="description" content="Edit marketing homepage copy for KDInsight." />
      </Head>
      <AuthGate>
        <AdminOnlyGate>
          <DashboardShell activeNav="site" pageEyebrow="Tools" pageTitle="Home page editor">
            <SiteEditor />
          </DashboardShell>
        </AdminOnlyGate>
      </AuthGate>
    </>
  );
};

export default SiteEditorPage;
