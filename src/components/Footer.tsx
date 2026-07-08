import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>
        © {currentYear} Universitas Amikom Yogyakarta
      </p>
      <p className="version">
        Version 1.0.0
      </p>
    </footer>
  );
}