// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'Djsce@132') {
      localStorage.setItem('isAdmin', 'true');
      toast.success("Admin login successful!", { position: "top-center" });
      navigate('/admin');
    } else {
      toast.error("Incorrect admin password", { position: "top-center" });
    }
  };

  return (
    <div className="container mt-5">
      <BackButton />
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h4 className="mb-4">Admin Login</h4>
              <div className="mb-3">
                <label className="form-label">Enter Admin Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-100" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
