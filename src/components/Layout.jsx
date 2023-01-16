import React from 'react';

const Layout = ({ children }) => {
  return (
    <>
      <header className="header">
        <h1>Excel Cleaner</h1>
      </header>
      <body className="main">{children}</body>;
    </>
  );
};

export default Layout;
