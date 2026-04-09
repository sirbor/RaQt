import MainLayout from 'components/Layouts/MainLayout';
import SignUp from 'components/SignUp';
import type { NextPage } from 'next';

const SignUpPage: NextPage = () => {
  return (
    <MainLayout
      title="Create account · KDInsight"
      description="Create your KDInsight account to access your workspace."
      navbarProps={{
        logoColor: 'black',
      }}>
      <SignUp />
    </MainLayout>
  );
};

export default SignUpPage;
