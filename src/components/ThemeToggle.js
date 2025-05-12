// src/components/ThemeToggle.js
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="btn btn-sm btn-light ms-2"
      style={{ fontWeight: 'bold' }}
    >
      {darkMode ? '🌙 Dark Mode' : '☀ Light Mode'}
    </button>
  );
}
