// src/components/StudentRegister.js
import React, { useState } from 'react';
import axios from 'axios';

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    email: '',
    sap_id: '',
    full_name: '',
    gender: '',
    mobile: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePhotoChange = (e) => {
    setFormData({...formData, photo: e.target.files[0]});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = '';
      if (formData.photo) {
        const photoData = new FormData();
        photoData.append('file', formData.photo);
        const res = await axios.post('process.env.REACT_APP_BACKEND_URL/uploadPhoto', photoData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = res.data.fileUrl;
      }

      const profileData = {
        email: formData.email,
        sap_id: formData.sap_id,
        full_name: formData.full_name,
        gender: formData.gender,
        mobile: formData.mobile,
        photo_url: photoUrl
      };

      await axios.post('${process.env.REACT_APP_BACKEND_URL}/registerStudent', profileData);
      alert('Student profile registered successfully!');
      setFormData({
        email: '',
        sap_id: '',
        full_name: '',
        gender: '',
        mobile: '',
        photo: null
      });
    } catch (error) {
      alert('Error registering student.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Student Registration</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>SAP ID</label>
              <input type="text" name="sap_id" className="form-control" value={formData.sap_id} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Full Name</label>
              <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Mobile Number</label>
              <input type="tel" name="mobile" className="form-control" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Upload Profile Photo (optional)</label>
              <input type="file" accept="image/*" className="form-control" onChange={handlePhotoChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
