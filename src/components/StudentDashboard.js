import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from './BackButton';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function StudentDashboard() {
  const studentProfile = JSON.parse(localStorage.getItem('studentProfile'));
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedPaidStatus, setSelectedPaidStatus] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    if (studentProfile?.sap_id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/student-internships/${studentProfile.sap_id}`)
        .then((res) => {
          const sorted = res.data.sort(
            (a, b) => new Date(a.start_date) - new Date(b.start_date)
          );
          setInternships(sorted);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [studentProfile?.sap_id]);

  const academicYears = [...new Set(internships.map(i => i.academic_year).filter(Boolean))];
  const companies = [...new Set(internships.map(i => i.company_name).filter(Boolean))];
  const paidStatuses = [...new Set(internships.map(i => i.paid).filter(Boolean))];

  const filtered = internships.filter(i => (
    (selectedYear === 'All' || i.academic_year === selectedYear) &&
    (selectedCompany === 'All' || i.company_name === selectedCompany) &&
    (selectedPaidStatus === 'All' || i.paid === selectedPaidStatus)
  ));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filtered.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const companyCounts = {};
  filtered.forEach((i) => {
    const company = i.company_name || 'Unknown';
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

  if (!studentProfile) return <div className="container mt-5"><h4>No student profile found. Please login.</h4></div>;
  if (loading) return <div className="container mt-5"><h4>Loading records...</h4></div>;

  return (
    <div className="container mt-4 mb-5">
      <BackButton />
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="text-center mb-4">Student Dashboard</h3>
          <div className="row text-center">
            <div className="col-md-12 mb-4">
              <img src={studentProfile.photo_url} alt="Profile" className="img-thumbnail" style={{ width: '120px', height: '120px' }} />
              <h5 className="mt-3">{studentProfile.full_name}</h5>
            </div>
            <div className="col-md-4"><strong>Email:</strong> {studentProfile.email}</div>
            <div className="col-md-4"><strong>SAP ID:</strong> {studentProfile.sap_id}</div>
            <div className="col-md-4"><strong>Mobile:</strong> {studentProfile.mobile}</div>
          </div>
        </div>
      </div>

      {/* Total Internship Count */}
      <div className="row mb-4">
        <div className="col-md-4 offset-md-4">
          <div className="card text-white bg-primary text-center shadow-sm">
            <div className="card-body">
              <h5>Total Internships</h5>
              <h2>{filtered.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>Filter Internships</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Academic Year</label>
              <select className="form-control" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="All">All</option>
                {academicYears.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label>Company</label>
              <select className="form-control" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="All">All</option>
                {companies.map((comp, idx) => <option key={idx} value={comp}>{comp}</option>)}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label>Paid/Unpaid</label>
              <select className="form-control" value={selectedPaidStatus} onChange={e => setSelectedPaidStatus(e.target.value)}>
                <option value="All">All</option>
                {paidStatuses.map((stat, idx) => <option key={idx} value={stat}>{stat}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Internship Table + Pagination */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4>Your Internship Records</h4>
          {filtered.length === 0 ? <p>No records found.</p> : (
            <>
              <table className="table table-bordered mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>#</th><th>Company</th><th>Designation</th><th>Paid</th><th>Stipend</th><th>Currency</th><th>Duration</th><th>From</th><th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstRecord + index + 1}</td>
                      <td>{item.company_name || '-'}</td>
                      <td>{item.designation || '-'}</td>
                      <td>{item.paid || '-'}</td>
                      <td>{item.stipend || '0'}</td>
                      <td>{item.currency || '-'}</td>
                      <td>{item.duration || '0'}</td>
                      <td>{item.start_date || '-'}</td>
                      <td>{item.end_date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav>
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Paid vs Unpaid</h5>
            <Pie data={{
              labels: ['Paid', 'Unpaid'],
              datasets: [{
                data: [
                  filtered.filter(i => i.paid?.toLowerCase() === 'paid').length,
                  filtered.filter(i => i.paid?.toLowerCase() === 'unpaid').length
                ],
                backgroundColor: ['#36A2EB', '#FF6384']
              }]
            }} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Stipends by Company</h5>
            <Bar data={{
              labels: filtered.map(i => i.company_name),
              datasets: [{
                label: 'Stipend',
                data: filtered.map(i => parseInt(i.stipend) || 0),
                backgroundColor: '#4BC0C0'
              }]
            }} options={{ indexAxis: 'y' }} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Internships per Company</h5>
            <Bar data={{
              labels: Object.keys(companyCounts),
              datasets: [{
                label: 'Count',
                data: Object.values(companyCounts),
                backgroundColor: '#9966FF'
              }]
            }} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Internship Durations</h5>
            <Line data={{
              labels: filtered.map(i => i.company_name),
              datasets: [{
                label: 'Duration (Months)',
                data: filtered.map(i => parseInt(i.duration) || 0),
                borderColor: '#FF9F40',
                tension: 0.1
              }]
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
