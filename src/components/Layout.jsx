import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Link to="/">
        <header className="header">Excel Cleaner</header>
      </Link>
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
