// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';



export default function Home() {
  return (
    <div className="container mt-5 text-center">
      
      <h1 className="mb-4">Dwarkadas J. Sanghvi College of Engineering</h1>
      <h2 className="mb-4">Department of Computer Engineering</h2>
      <h3 className="mb-4">Internship Portal</h3>
   
      
      <div className="d-grid gap-3 col-6 mx-auto">
        <Link to="/form" className="btn btn-primary btn-lg">Internship Form</Link>
        <Link to="/student" className="btn btn-success btn-lg">Student Dashboard</Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg">Student Registration</Link>
        <Link to="/login" className="btn btn-outline-success btn-lg">Student Login</Link>
        <Link to="/admin" className="btn btn-dark btn-lg">Admin Dashboard</Link>
      </div>
    </div>
  );
}
