// src/components/Layout/Layout.jsx
import React from 'react';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <NavBar />
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
