// src/components/InternshipForm.js
// import React, { useState } from 'react';

import React, { useState, useEffect } from 'react';   // ✅ Add useEffect
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

export default function InternshipForm() {
  const years = ['Second Year', 'Third Year', 'Final Year'];
  const divisions = ['C1', 'C2', 'C3'];
  const currencies = ['INR', 'Dollar', 'Pound'];
  const academicYears = ['2024-25', '2025-26', '2026-27'];
  const genders = ['Male', 'Female', 'Other'];

  const initialState = {
    email: '',
    sap_id: '',
    roll_number: '',
    full_name: '',
    mobile: '',
    gender: '',
    year: '',
    division: '',
    academic_year: '',
    company_name: '',
    designation: '',
    paid: '',
    stipend: '',
    currency: '',
    duration: '',
    start_date: '',
    end_date: '',
    file_url: ''
  };

  // ✅ NEW CODE: Load student profile on page load
  useEffect(() => {
    const studentProfile = JSON.parse(localStorage.getItem('studentProfile'));
    if (studentProfile) {
      setFormData((prev) => ({
        ...prev,
        email: studentProfile.email || '',
        sap_id: studentProfile.sap_id || '',
        full_name: studentProfile.full_name || '',
        gender: studentProfile.gender || '',
        mobile: studentProfile.mobile || ''
      }));
    }
  }, []);


  const [formData, setFormData] = useState(initialState);
  const [fileOption, setFileOption] = useState('');
  const [singleFile, setSingleFile] = useState(null);
  const [coverPage, setCoverPage] = useState(null);
  const [noc, setNoc] = useState(null);
  const [confirmationMail, setConfirmationMail] = useState(null);
  const [joiningMail, setJoiningMail] = useState(null);
  const [completionCertificate, setCompletionCertificate] = useState(null);
  const [supervisorReport, setSupervisorReport] = useState(null);
  const [collegeReport, setCollegeReport] = useState(null);
  const [internshipReport, setInternshipReport] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleFileOptionChange = (e) => {
    setFileOption(e.target.value);
    setSingleFile(null);
    setCoverPage(null);
    setNoc(null);
    setConfirmationMail(null);
    setJoiningMail(null);
    setCompletionCertificate(null);
    setSupervisorReport(null);
    setCollegeReport(null);
    setInternshipReport(null);
  };

  const mergePDFs = async (files) => {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      if (!file) continue;
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {...formData};
    if (finalData.paid === 'Unpaid') {
      finalData.stipend = 'N.A';
    }

    try {
      let fileBlob;
      if (fileOption === 'single' && singleFile) {
        fileBlob = singleFile;
      } else if (fileOption === 'multiple') {
        const files = [
          coverPage, noc, confirmationMail, joiningMail,
          completionCertificate, supervisorReport, collegeReport, internshipReport
        ];
        fileBlob = await mergePDFs(files);
      }

      if (fileBlob) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', fileBlob, 'proof.pdf');
        const res = await axios.post('${process.env.REACT_APP_BACKEND_URL}/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalData.file_url = res.data.fileUrl;
      }

      await axios.post('${process.env.REACT_APP_BACKEND_URL}/submitData', finalData);
      alert("Internship data submitted successfully!");
      setFormData(initialState);
      setFileOption('');
      setSingleFile(null);
      setCoverPage(null);
      setNoc(null);
      setConfirmationMail(null);
      setJoiningMail(null);
      setCompletionCertificate(null);
      setSupervisorReport(null);
      setCollegeReport(null);
      setInternshipReport(null);
    } catch (error) {
      alert("Error submitting data.");
      console.error(error);
    }
  };


  return (
    
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Internship Data Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>SAP ID</label>
                <input type="number" name="sap_id" className="form-control" value={formData.sap_id} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>Roll Number</label>
                <input type="text" name="roll_number" className="form-control" value={formData.roll_number} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label>Full Name</label>
                <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>Mobile Number</label>
                <input type="tel" name="mobile" className="form-control" maxLength="14" pattern="[0-9]{10,14}" value={formData.mobile} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>Gender</label>
                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  {genders.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label>Year</label>
                <select name="year" className="form-select" value={formData.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {years.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Division</label>
                <select name="division" className="form-select" value={formData.division} onChange={handleChange} required>
                  <option value="">Select Division</option>
                  {divisions.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Academic Year</label>
                <select name="academic_year" className="form-select" value={formData.academic_year} onChange={handleChange} required>
                  <option value="">Select Academic Year</option>
                  {academicYears.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label>Company Name & Address</label>
              <input type="text" name="company_name" className="form-control" value={formData.company_name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Designation / Post / Role</label>
              <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Paid / Unpaid</label>
              <select name="paid" className="form-select" value={formData.paid} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Total Monthly Stipend (numeric)</label>
              <input type="number" name="stipend" className="form-control"
                     disabled={formData.paid !== 'Paid'}
                     value={formData.paid === 'Unpaid' ? 'N.A' : formData.stipend}
                     onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Currency</label>
              <select name="currency" className="form-select" value={formData.currency} onChange={handleChange}>
                <option value="">Select Currency</option>
                {currencies.map((opt, i) => (<option key={i} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div className="mb-3">
              <label>Internship Duration (In Months)</label>
              <input type="number" name="duration" className="form-control" value={formData.duration} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Start Date</label>
              <input type="date" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>End Date</label>
              <input type="date" name="end_date" className="form-control" value={formData.end_date} onChange={handleChange} required />
            </div>

            {/* File Upload Section */}
            <div className="mb-3 mt-4">
              <label className="form-label">Do you have a combined final proof PDF?</label><br/>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="fileOption" value="single" checked={fileOption === 'single'} onChange={handleFileOptionChange} />
                <label className="form-check-label">Yes, I have a single PDF</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="fileOption" value="multiple" checked={fileOption === 'multiple'} onChange={handleFileOptionChange} />
                <label className="form-check-label">No, I want to upload individual documents</label>
              </div>
            </div>

            {fileOption === 'single' && (
              <div className="mb-3">
                <label className="form-label">Upload Final Combined PDF</label>
                <input type="file" className="form-control" accept="application/pdf" onChange={(e) => setSingleFile(e.target.files[0])} />
              </div>
            )}

            {fileOption === 'multiple' && (
              <>
                <div className="mb-3"><label>1. Cover Page</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setCoverPage(e.target.files[0])} /></div>
                <div className="mb-3"><label>2. NOC From College</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setNoc(e.target.files[0])} /></div>
                <div className="mb-3"><label>3. Internship Confirmation Mail (optional)</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setConfirmationMail(e.target.files[0])} /></div>
                <div className="mb-3"><label>4. Joining Mail (optional)</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setJoiningMail(e.target.files[0])} /></div>
                <div className="mb-3"><label>5. Internship Completion Certificate</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setCompletionCertificate(e.target.files[0])} /></div>
                <div className="mb-3"><label>6. Supervisor Evaluation Report</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setSupervisorReport(e.target.files[0])} /></div>
                <div className="mb-3"><label>7. College Evaluation Report</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setCollegeReport(e.target.files[0])} /></div>
                <div className="mb-3"><label>8. Internship Report</label><input type="file" accept="application/pdf" className="form-control" onChange={(e) => setInternshipReport(e.target.files[0])} /></div>
              </>
            )}

            <button type="submit" className="btn btn-primary w-100 mt-3">Submit Internship Data</button>
          </form>
        </div>
      </div>
    </div>
    
  );
 
}
