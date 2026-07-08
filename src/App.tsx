import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StudentCard } from './components/StudentCard';
import { StudentForm } from './components/StudentForm';
import { Student, StudentFormData } from './types/Student';
import './App.css';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'students'>('dashboard');

  // Search, Filter, Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = async (studentData: StudentFormData) => {
    try {
      const res = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (!res.ok) throw new Error('Failed to add student');
      const newStudent = await res.json();
      setStudents([...students, newStudent]);
      setShowAddForm(false);
      alert(`Student ${newStudent.name} added successfully!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditStudent = async (id: string, updates: StudentFormData) => {
    try {
      const res = await fetch(`http://localhost:3001/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update student');
      const updatedStudent = await res.json();
      setStudents(students.map(student => student.id === id ? updatedStudent : student));
      setEditingStudent(null);
      alert('Student updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?\n\n' +
      'This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');
      setStudents(students.filter(student => student.id !== id));
      alert('Student deleted successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getTotalStudents = () => students.length;
  const getActiveStudents = () => students.filter(s => s.status === 'active').length;
  const getAverageGPA = () => {
    if (students.length === 0) return '0.00';
    const total = students.reduce((sum, s) => sum + s.gpa, 0);
    return (total / students.length).toFixed(2);
  };

  // Derived Data for Display
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nim.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <div className="main-content">
        <Header />

        <main className="view-content">
          {currentView === 'dashboard' && (
            <div className="dashboard-view">
              <h2 className="view-title">Overview</h2>
              <div className="stats">
                <div className="stat-card">
                  <h3>{getTotalStudents()}</h3>
                  <p>Total Students</p>
                </div>
                <div className="stat-card">
                  <h3>{getActiveStudents()}</h3>
                  <p>Active Students</p>
                </div>
                <div className="stat-card">
                  <h3>{getAverageGPA()}</h3>
                  <p>Average GPA</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'students' && (
            <div className="students-view">
              <div className="view-header">
                <h2 className="view-title">Student Data</h2>
                <div className="actions">
                  <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                    + Add New Student
                  </button>
                </div>
              </div>

              <div className="controls-bar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search by Name or NIM..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-box">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="graduated">Graduated</option>
                    <option value="dropout">Dropout</option>
                  </select>
                </div>
              </div>

              <div className="students-container">
                {loading ? (
                  <div className="empty-state"><p>Loading students...</p></div>
                ) : error ? (
                  <div className="empty-state" style={{ color: 'red' }}>
                    <p>Error: {error}</p>
                    <button className="btn btn-primary" onClick={fetchStudents}>Retry</button>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="empty-state">
                    <p>No students found.</p>
                  </div>
                ) : (
                  <>
                    <div className="students-grid">
                      {currentStudents.map(student => (
                        <StudentCard
                          key={student.id}
                          {...student}
                          onEdit={() => setEditingStudent(student)}
                          onDelete={() => handleDeleteStudent(student.id)}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          className="btn-page" 
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Previous
                        </button>
                        <span className="page-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button 
                          className="btn-page" 
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        {showAddForm && (
          <StudentForm onSubmit={handleAddStudent} onClose={() => setShowAddForm(false)} />
        )}
        {editingStudent && (
          <StudentForm initialData={editingStudent} onSubmit={(updates) => handleEditStudent(editingStudent.id, updates)} onClose={() => setEditingStudent(null)} />
        )}
      </div>
    </div>
  );
}

export default App;

