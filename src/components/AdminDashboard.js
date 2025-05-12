// src/components/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import BackButton from './BackButton';
import { Navigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    academic_year: 'All',
    division: 'All',
    year: 'All',
    paid: 'All',
    company_name: 'All',
    gender: 'All',
    currency: 'All',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dashboardRef = useRef();

  useEffect(() => {
    axios.get('${process.env.REACT_APP_BACKEND_URL}/api/all-internships')
      .then(res => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      (filters.academic_year === 'All' || item.academic_year === filters.academic_year) &&
      (filters.division === 'All' || item.division === filters.division) &&
      (filters.year === 'All' || item.year === filters.year) &&
      (filters.paid === 'All' || item.paid === filters.paid) &&
      (filters.company_name === 'All' || item.company_name === filters.company_name) &&
      (filters.gender === 'All' || item.gender === filters.gender) &&
      (filters.currency === 'All' || item.currency === filters.currency)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, data]);

  const uniqueValues = field => [...new Set(data.map(d => d[field]).filter(Boolean))];
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Internships");
    XLSX.writeFile(workbook, "Admin_Internships_Data.xlsx");
  };

  const getCount = (field, value) => filteredData.filter(item => item[field] === value).length;

  const getStipendSumByCompany = () => {
    const companyStipends = {};
    filteredData.forEach(item => {
      const company = item.company_name || 'Unknown';
      const stipend = parseFloat(item.stipend) || 0;
      companyStipends[company] = (companyStipends[company] || 0) + stipend;
    });
    return companyStipends;
  };

  const getInternshipsOverTime = () => {
    const monthlyCounts = {};
    filteredData.forEach(item => {
      if (item.start_date) {
        const date = new Date(item.start_date);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
      }
    });
    const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => {
      const [aMonth, aYear] = a.split('-').map(Number);
      const [bMonth, bYear] = b.split('-').map(Number);
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
    });
    return { labels: sortedMonths, data: sortedMonths.map(month => monthlyCounts[month]) };
  };

  const downloadPDF = () => {
    html2canvas(dashboardRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Admin_Dashboard.pdf");
    });
  };

  const isAdmin = localStorage.getItem('isAdmin');
  if (!isAdmin) return <Navigate to="/admin-login" />;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="container mt-4 mb-5" ref={dashboardRef}>
      <BackButton />
      <h3 className="text-center mb-4">Admin Internship Dashboard</h3>

      {/* Stats */}
      <div className="row text-center mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Total Records</h4>
              <h2>{filteredData.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Total Students</h4>
              <h2>{new Set(filteredData.map(d => d.email)).size}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Filters</h5>
          <div className="row">
            {['academic_year', 'division', 'year', 'paid', 'company_name', 'gender', 'currency'].map(field => (
              <div key={field} className="col-md-2 col-sm-4 col-6 mb-3">
                <label className="form-label">{field.replace('_', ' ').toUpperCase()}</label>
                <select className="form-select" value={filters[field]} onChange={e => setFilters(prev => ({ ...prev, [field]: e.target.value }))}>
                  <option value="All">All</option>
                  {uniqueValues(field).map((val, i) => <option key={i} value={val}>{val}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export + Download */}
      <div className="d-flex justify-content-end gap-3 mb-3">
        <button className="btn btn-success" onClick={exportExcel}>Download Excel</button>
        <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
      </div>

      {/* Table with Pagination */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              {data.length > 0 &&
                Object.keys(data[0])
                  .filter(key => !['academic_year', 'mobile', 'year', 'division', 'file_url'].includes(key))
                  .map((key, index) => <th key={index}>{key.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, i) => (
              <tr key={i}>
                {Object.entries(row)
                  .filter(([key]) => !['academic_year', 'mobile', 'year', 'division', 'file_url'].includes(key))
                  .map(([key, val], j) => <td key={j}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}</small>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <button className="btn btn-sm btn-outline-primary" disabled={currentPage >= Math.ceil(filteredData.length / rowsPerPage)} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-5 g-4 justify-content-center">
        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Paid vs Unpaid</h5>
            <Pie data={{
              labels: ['Paid', 'Unpaid'],
              datasets: [{ data: [getCount('paid', 'Paid'), getCount('paid', 'Unpaid')], backgroundColor: ['#36A2EB', '#FF6384'] }]
            }} />
          </div>
        </div>

        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Gender Distribution</h5>
            <Pie data={{
              labels: uniqueValues('gender'),
              datasets: [{ data: uniqueValues('gender').map(gender => getCount('gender', gender)), backgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF'] }]
            }} />
          </div>
        </div>

        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Internships per Company</h5>
            <Bar data={{
              labels: uniqueValues('company_name'),
              datasets: [{ label: 'Internships', data: uniqueValues('company_name').map(company => getCount('company_name', company)), backgroundColor: '#4BC0C0' }]
            }} options={{ indexAxis: 'y' }} />
          </div>
        </div>

        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Internships per Division</h5>
            <Bar data={{
              labels: uniqueValues('division'),
              datasets: [{ label: 'Internships', data: uniqueValues('division').map(division => getCount('division', division)), backgroundColor: '#FF9F40' }]
            }} options={{ indexAxis: 'y' }} />
          </div>
        </div>

        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Internships per Academic Year</h5>
            <Bar data={{
              labels: uniqueValues('academic_year'),
              datasets: [{ label: 'Internships', data: uniqueValues('academic_year').map(year => getCount('academic_year', year)), backgroundColor: '#36A2EB' }]
            }} />
          </div>
        </div>

        <div className="col-md-5">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Trends Over Time</h5>
            <Line data={{
              labels: getInternshipsOverTime().labels,
              datasets: [{ label: 'Internships', data: getInternshipsOverTime().data, fill: false, borderColor: '#9966FF', tension: 0.1 }]
            }} />
          </div>
        </div>

        <div className="col-md-10">
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="text-center">Total Stipends per Company</h5>
            <Bar data={{
              labels: Object.keys(getStipendSumByCompany()),
              datasets: [{ label: 'Total Stipend', data: Object.values(getStipendSumByCompany()), backgroundColor: '#FF6384' }]
            }} options={{ indexAxis: 'y' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
