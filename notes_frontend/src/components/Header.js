import React from "react";

// PUBLIC_INTERFACE
function Header({ user, onLogout, onSidebarToggle, onCreate }) {
  return (
    <header className="notes-header">
      <button
        className="sidebar-toggle-btn"
        aria-label="Open sidebar"
        onClick={onSidebarToggle}
      >
        <span className="sidebar-toggle-icon">&#9776;</span>
      </button>
      <span className="notes-logo">
        <span style={{ color: "#1976D2", fontWeight: 700 }}>Notes</span> <span style={{ color: "#FFC107" }}>App</span>
      </span>
      <nav className="notes-nav">
        <button className="btn-primary" style={{ marginRight: 18 }} onClick={onCreate}>+ New Note</button>
        <span className="user-email">{user.email}</span>
        <button className="btn-secondary" onClick={onLogout} style={{ marginLeft: 12 }}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;
