// src/components/StudentLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastUtils';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [sapId, setSapId] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('process.env.REACT_APP_BACKEND_URL/loginStudent', { email, sap_id: sapId });
      localStorage.setItem('studentProfile', JSON.stringify(res.data));
      showToast('Student Login Successful!');
      navigate('/student');
    } catch (error) {
      showToast('Login Failed. Please check your details.', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Student Login</h3>
      <div className="mb-3">
        <label>Email ID</label>
        <input 
          type="email" 
          className="form-control" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>SAP ID</label>
        <input 
          type="text" 
          className="form-control" 
          value={sapId}
          onChange={e => setSapId(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
    </div>
  );
}
