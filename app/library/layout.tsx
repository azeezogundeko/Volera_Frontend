import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Explore - Volera',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
