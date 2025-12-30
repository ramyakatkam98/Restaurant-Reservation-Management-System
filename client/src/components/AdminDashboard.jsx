import { useEffect, useState } from 'react';
import { getAdminReservations } from '../api';
import api from '../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  async function loadData() {
    setLoading(true);
    try {
      const [resData, tablesData] = await Promise.all([
        getAdminReservations(),
        api.getTables().catch(() => [])
      ]);
      console.log('Loaded reservations:', resData);
      console.log('Loaded tables:', tablesData);
      setReservations(resData || []);
      setTables(tablesData || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
      alert('Failed to load data: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateReservation(id, status) {
    try {
      await api.updateReservation(id, { status });
      await loadData();
    } catch (err) {
      console.error('Failed to update reservation', err);
      alert('Failed to update reservation');
    }
  }

  async function handleDeleteTable(id) {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await api.deleteTable(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete table', err);
      alert('Failed to delete table');
    }
  }

  const filteredReservations = reservations.filter(r => {
    if (selectedDate && r.date !== selectedDate) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'ACTIVE').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    completed: reservations.filter(r => r.status === 'COMPLETED').length,
    today: reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'ACTIVE': 'status-active',
      'CANCELLED': 'status-cancelled',
      'COMPLETED': 'status-completed'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage reservations and restaurant tables</p>
        </div>
        <div className="admin-actions">
          <button className="btn-refresh" onClick={loadData} disabled={loading}>
            {loading ? '⟳' : '↻'} Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-total">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Reservations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-active">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-today">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-cancelled">✗</div>
          <div className="stat-content">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          📋 Reservations
        </button>
        <button
          className={`tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          🪑 Tables
        </button>
      </div>

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="admin-content">
          {/* Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <label>Filter by Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="filter-input"
              />
              {selectedDate && (
                <button className="btn-clear" onClick={() => setSelectedDate('')}>✕</button>
              )}
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="ACTIVE">Active</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="filter-info">
              Showing {filteredReservations.length} of {reservations.length} reservations
            </div>
          </div>

          {/* Reservations Table */}
          {loading ? (
            <div className="loading-state">Loading reservations...</div>
          ) : filteredReservations.length === 0 ? (
            <div className="empty-state-enhanced">
              <div className="empty-icon">📭</div>
              <h3>No reservations found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="reservations-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{(r.userId || r.user)?.name || (r.userId || r.user)?.email || 'N/A'}</div>
                          {((r.userId || r.user)?.email) && <div className="customer-email">{(r.userId || r.user).email}</div>}
                        </div>
                      </td>
                      <td>{formatDate(r.date)}</td>
                      <td>{r.timeSlot}</td>
                      <td>{r.guests}</td>
                      <td>
                        {r.tableId?.tableNumber ? (
                          <span className="table-badge">Table {r.tableId.tableNumber}</span>
                        ) : (
                          <span className="table-badge muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {r.status === 'ACTIVE' && (
                            <>
                              <button
                                className="btn-action btn-complete"
                                onClick={() => handleUpdateReservation(r._id, 'COMPLETED')}
                                title="Mark as Completed"
                              >
                                ✓
                              </button>
                              <button
                                className="btn-action btn-cancel"
                                onClick={() => handleUpdateReservation(r._id, 'CANCELLED')}
                                title="Cancel"
                              >
                                ✗
                              </button>
                            </>
                          )}
                          {r.status === 'COMPLETED' && (
                            <button
                              className="btn-action btn-reactivate"
                              onClick={() => handleUpdateReservation(r._id, 'ACTIVE')}
                              title="Reactivate"
                            >
                              ↻
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="admin-content">
          {loading ? (
            <div className="loading-state">Loading tables...</div>
          ) : tables.length === 0 ? (
            <div className="empty-state-enhanced">
              <div className="empty-icon">🪑</div>
              <h3>No tables configured</h3>
              <p>Add tables to start accepting reservations.</p>
            </div>
          ) : (
            <div className="tables-grid">
              {tables.map((table) => (
                <div key={table._id} className="table-card">
                  <div className="table-card-header">
                    <div className="table-number">Table {table.tableNumber}</div>
                    <button
                      className="btn-delete-table"
                      onClick={() => handleDeleteTable(table._id)}
                      title="Delete Table"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="table-card-body">
                    <div className="table-info">
                      <span className="table-label">Capacity:</span>
                      <span className="table-value">{table.capacity} guests</span>
                    </div>
                    <div className="table-info">
                      <span className="table-label">Status:</span>
                      <span className={`table-status ${table.available !== false ? 'available' : 'unavailable'}`}>
                        {table.available !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
