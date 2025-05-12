// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-3 fixed-bottom">
      © {new Date().getFullYear()} Internship Portal developed and managed by the Department of Computer Engineering, DJSCE. All Rights Reserved.
    </footer>
  );
}
