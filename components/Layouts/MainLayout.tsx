import React, { ReactNode, useState } from 'react';
import Navbar, { NavbarProps } from 'components/Navbar';
import Head from 'next/head';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
  navbarProps?: NavbarProps;
}

const MainLayout: React.FC<Props> = ({ title, description, children, navbarProps }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Head>
        {title ? <title>{title}</title> : null}
        <meta
          name="description"
          content={
            description ||
            'KDInsight commerce infrastructure for sales, inventory, staff, payments, and hybrid channels. Built for SMEs in Kenya and East Africa, architected to scale globally with one connected record.'
          }
        />
      </Head>
      <Navbar setOpen={() => setOpen(!open)} {...navbarProps} />
      <Sidebar open={open} setOpen={() => setOpen(!open)} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </React.Fragment>
  );
};

MainLayout.defaultProps = {};

export default MainLayout;
