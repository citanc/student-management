import React from 'react';

interface StudentCardProps {
  name: string;
  nim: string;
  email: string;
  class: string;
  gpa: number;
  status: 'active' | 'graduated' | 'dropout';
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StudentCard({
  name,
  nim,
  email,
  class: className,
  gpa,
  status,
  onEdit,
  onDelete
}: StudentCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'graduated':
        return 'status-graduated';
      case 'dropout':
        return 'status-dropout';
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    const labels = {
      'active': 'Aktif',
      'graduated': 'Lulus',
      'dropout': 'Dropout'
    };
    return labels[status];
  };

  return (
    <div className="student-card">
      <div className="student-header">
        <h3 className="student-name">{name}</h3>
        <span className={`status-badge ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="student-info">
        <div className="info-row">
          <span className="label">NIM:</span>
          <span className="value">{nim}</span>
        </div>
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">{email}</span>
        </div>
        <div className="info-row">
          <span className="label">Kelas:</span>
          <span className="value">{className}</span>
        </div>
        <div className="info-row">
          <span className="label">IPK:</span>
          <span className="value">{gpa.toFixed(2)}</span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="student-actions">
          {onEdit && (
            <button className="btn btn-edit" onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className="btn btn-delete" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
