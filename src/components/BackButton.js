// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  
  return (
    <button
      className="btn btn-outline-secondary mb-3"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
}
