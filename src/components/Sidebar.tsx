import React from 'react';

interface SidebarProps {
  currentView: 'dashboard' | 'students';
  setView: (view: 'dashboard' | 'students') => void;
}

export function Sidebar({ currentView, setView }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SMM</h2>
        <p>Universitas Amikom</p>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          <span className="icon">📊</span>
          Dashboard
        </button>
        
        <button 
          className={`nav-item ${currentView === 'students' ? 'active' : ''}`}
          onClick={() => setView('students')}
        >
          <span className="icon">🎓</span>
          Student Data
        </button>
      </nav>
    </aside>
  );
}
