import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ onAuth }) {
  const [selectedRole, setSelectedRole] = useState("customer"); // "customer" | "admin"
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggle = () => {
    // only allow register for customers
    if (selectedRole === "admin") return;
    setIsRegister((s) => !s);
    setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      // admin can only login (no register UI)
      const url =
        isRegister && selectedRole === "customer"
          ? "/api/auth/register"
          : "/api/auth/login";

      const body =
        url.endsWith("/register") ? { name, email, password } : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errorMessage = "Authentication failed";
        try {
          const err = await res.json();
          errorMessage = err.message || errorMessage;
        } catch (e) {
          // If response is not JSON, try to get text
          const text = await res.text().catch(() => "");
          errorMessage = text || `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      // store token & basic user info
      localStorage.setItem("token", data.token);
      const roleFromServer = data.user && data.user.role ? data.user.role : selectedRole;
      localStorage.setItem("userName", (data.user && (data.user.name || data.user.email)) || "");
      localStorage.setItem("role", (roleFromServer || "user").toLowerCase());

      onAuth && onAuth({ role: roleFromServer, userName: data.user ? (data.user.name || data.user.email) : "" });

      // if admin, navigate to admin dashboard
      if ((roleFromServer || "").toLowerCase() === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-welcome">
        <h1>Restaurant Reservation Management System</h1>
        <p>Sign in to manage your reservations</p>
      </div>
      
      <div className="role-switch" role="tablist" aria-label="Select role">
        <button
          type="button"
          className={`role-btn ${selectedRole === "customer" ? "active" : ""}`}
          onClick={() => {
            setSelectedRole("customer");
            setIsRegister(false);
            setError(null);
          }}
          aria-pressed={selectedRole === "customer"}
        >
          Customer
        </button>
        <button
          type="button"
          className={`role-btn ${selectedRole === "admin" ? "active" : ""}`}
          onClick={() => {
            setSelectedRole("admin");
            setIsRegister(false); // admin only login
            setError(null);
          }}
          aria-pressed={selectedRole === "admin"}
        >
          Admin
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} style={{ minWidth: 360 }}>
        {/* show register toggle only for customer */}
        <div className="auth-header">
          <h3>{selectedRole === "admin" ? "Admin Sign in" : isRegister ? "Create New Account" : "Sign in"}</h3>
          {selectedRole === "customer" && (
            <button type="button" className="link-btn small" onClick={toggle}>
              {isRegister ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
          )}
        </div>

        {isRegister && selectedRole === "customer" && (
          <div className="form-row">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}

        <div className="form-row">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="auth-actions">
          <button type="submit" className="primary">
            {selectedRole === "admin" ? "Sign in as Admin" : isRegister ? "Register" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
