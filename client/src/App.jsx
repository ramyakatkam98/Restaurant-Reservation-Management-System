import React, { useEffect, useState } from "react";
import "./styles.css";
import ReservationsList from "./components/ReservationsList";
import ReservationForm from "./components/ReservationForm";
import AuthForm from "./components/AuthForm";
import AdminDashboard from "./components/AdminDashboard";
import api from "./api";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('userName') || null);
  const [role, setRole] = useState((localStorage.getItem('role') || '').toLowerCase() || null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) load();
  }, [role]);

  async function handleCreate(payload) {
    const created = await api.createReservation(payload);
    if (created) setReservations((s) => [created, ...s]);
    return created;
  }

  async function handleCancel(id) {
    await api.cancelReservation(id);
    setReservations((s) => s.map(r => r._id === id ? { ...r, status: 'CANCELLED' } : r));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    setReservations([]);
  }

  function handleAuth({ role: r, userName }) {
    const normalized = (r || '').toLowerCase();
    setRole(normalized);
    setUser(userName);
    if (normalized === 'admin') {
      // admin view handled in render
    } else {
      load();
    }
  }

  return (
    <Router>
      <div className="app-root">
        {localStorage.getItem('token') && (
          <header className="app-header-bar">
            <div className="header-content">
              <h1 className="app-title">Restaurant Reservation System</h1>
              <div className="header-actions">
                <span className="user-info">
                  {user && <span className="user-name">{user}</span>}
                  {role && <span className="user-role">{role === 'admin' ? 'Administrator' : 'Customer'}</span>}
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </header>
        )}
        <main className="container">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={
              !localStorage.getItem('token') ? (
                <div className="auth-container">
                  <AuthForm onAuth={handleAuth} />
                </div>
              ) : role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <div className="customer-dashboard">
                  <div className="dashboard-header">
                    <h2>My Reservations</h2>
                    <p>Manage your table reservations</p>
                  </div>
                  <div className="dashboard-content">
                    <section className="left-panel">
                      <ReservationForm onCreate={handleCreate} />
                    </section>
                    <section className="right-panel">
                      {loading ? (
                        <div className="loading-container">
                          <div className="spinner"></div>
                          <p>Loading reservations...</p>
                        </div>
                      ) : (
                        <ReservationsList reservations={reservations} onCancel={handleCancel} />
                      )}
                    </section>
                  </div>
                </div>
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
