import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api";

export default function Header({ onLogout, user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const navigate = useNavigate();

  useEffect(() => {
    // try to load current user if not passed from props
    if (!propUser) {
      getCurrentUser().then(setUser).catch(() => setUser(null));
    }
  }, [propUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    setUser(null);
    onLogout && onLogout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/">Restaurant Reservation Management System</Link>
      </div>

      <nav className="main-nav">
        {/* Customer button/link */}
        {user && (user.role || "").toLowerCase() !== "admin" && (
          <Link to="/" className="nav-btn">Customer Portal</Link>
        )}

        {/* Admin button only visible to admins */}
        {user && (user.role || "").toLowerCase() === "admin" && (
          <Link to="/admin" className="nav-btn">Admin Dashboard</Link>
        )}
      </nav>

      <div className="auth-area">
        {user ? (
          <>
            <span className="user-label">{user.name || user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/">Sign in</Link>
        )}
      </div>
    </header>
  );
}
