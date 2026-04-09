import MainLayout from 'components/Layouts/MainLayout';
import SignIn from 'components/SignIn';
import type { NextPage } from 'next';

const SignInPage: NextPage = () => {
  return (
    <MainLayout
      title="Account access · KDInsight"
      description="Register for a new KDInsight account or sign in to your workspace as a client or administrator."
      navbarProps={{
        logoColor: 'black',
      }}>
      <SignIn />
    </MainLayout>
  );
};

export default SignInPage;
