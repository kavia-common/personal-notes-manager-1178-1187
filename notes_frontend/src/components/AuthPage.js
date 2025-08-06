import React, { useState } from "react";

// PUBLIC_INTERFACE
function AuthPage({ onAuth, API_BASE }) {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = page === "login" ? "/auth/login" : "/auth/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      // Registration returns 201, login returns 200
      if (res.ok) {
        // login returns {token}, register returns {} so do login after register
        if (page === "register") {
          setPage("login");
          setError("Account created. Sign in now!");
          setPw("");
          return;
        }
        const data = await res.json();
        onAuth(data);
      } else {
        const errMsg = await res.text();
        setError(errMsg || "Authentication failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="auth-page-outer">
      <div className="auth-card">
        <h2 className="auth-title">
          Notes <span style={{ color: "#1976D2" }}>App</span>
        </h2>
        <form className="auth-form" onSubmit={submit}>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
          />
          <input
            type="password"
            autoComplete={page === "login" ? "current-password" : "new-password"}
            required
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Password"
          />
          {error && (
            <div className="auth-error">{error}</div>
          )}
          <button className="btn-primary" type="submit">
            {page === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="auth-switch">
          {page === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" className="link-btn" onClick={() => { setPage("register"); setError(""); }}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => { setPage("login"); setError(""); }}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
      <footer className="auth-footer">
        <span>
          <span style={{ color: "#1976D2", fontWeight: "bold" }}>Personal Notes</span> – Crafted for modern productivity
        </span>
      </footer>
    </div>
  );
}

export default AuthPage;
