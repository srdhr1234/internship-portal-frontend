// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();
  const isStudent = localStorage.getItem('studentProfile');
  const isAdmin = localStorage.getItem('isAdmin');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fs-4 fw-bold text-white" to="/">Internship Portal</Link>

     
        <button className="navbar-toggler p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto fs-5">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            {isStudent && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/form">Internship Form</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/student">Student Dashboard</Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin">Admin Dashboard</Link>
              </li>
            )}
          </ul>

          {(isStudent || isAdmin) && (
            <button className="btn btn-outline-light border-white fw-semibold px-3 py-2 ms-2" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
