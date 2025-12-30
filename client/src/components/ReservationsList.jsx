import React from 'react';

export default function ReservationsList({ reservations = [], onCancel }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'ACTIVE': 'status-active',
      'CANCELLED': 'status-cancelled',
      'COMPLETED': 'status-completed'
    };
    return statusMap[status] || 'status-default';
  };

  if (!reservations.length) {
    return (
      <div className="reservations-container">
        <div className="empty-state-enhanced">
          <div className="empty-icon">📅</div>
          <h3>No reservations yet</h3>
          <p>Create your first reservation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h3>Your Reservations</h3>
        <span className="reservation-count">{reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}</span>
      </div>
      
      <div className="reservations-grid">
        {reservations.map((r) => (
          <div key={r._id} className="reservation-card">
            <div className="reservation-card-header">
              <div className="reservation-date-time">
                <div className="reservation-date">{formatDate(r.date)}</div>
                <div className="reservation-time">{r.timeSlot}</div>
              </div>
              <span className={`status-badge ${getStatusClass(r.status)}`}>
                {r.status}
              </span>
            </div>
            <div className="reservation-card-body">
              <div className="reservation-detail">
                <span className="detail-label">👥 Guests</span>
                <span className="detail-value">{r.guests}</span>
              </div>
              <div className="reservation-detail">
                <span className="detail-label">🪑 Table</span>
                <span className="detail-value">
                  {r.tableId ? `Table ${r.tableId.tableNumber || r.tableId._id}` : '—'}
                </span>
              </div>
            </div>
            {r.status === 'ACTIVE' && (
              <div className="reservation-card-footer">
                <button 
                  className="btn-cancel-reservation" 
                  onClick={() => onCancel && onCancel(r._id)}
                >
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
