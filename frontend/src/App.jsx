import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportIssue from "./pages/ReportIssue";
import DepartmentDashboard from "./pages/DepartmentDashboard";

function App() {
  const [page, setPage] = useState("home");

  // ================================
  // LOGIN SUCCESS
  // ================================
  const handleLoginSuccess = (user) => {
    console.log("=================================");
    console.log("LOGIN SUCCESS");
    console.log("USER:", user);
    console.log("ROLE:", user?.role);
    console.log("=================================");

    if (user?.role === "admin") {
      console.log("➡️ Opening Department Dashboard");
      setPage("department");
    } else {
      console.log("➡️ Opening Citizen Dashboard");
      setPage("dashboard");
    }
  };

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setPage("home");
  };

  // ================================
  // REPORT ISSUE PAGE
  // ================================
  if (page === "report") {
    return (
      <ReportIssue
        onBack={() => setPage("dashboard")}
      />
    );
  }

  // ================================
  // DEPARTMENT DASHBOARD
  // ================================
  if (page === "department") {
    console.log("Department Dashboard is being rendered");

    return (
      <DepartmentDashboard
        onLogout={handleLogout}
      />
    );
  }

  // ================================
  // CITIZEN DASHBOARD
  // ================================
  if (page === "dashboard") {
    return (
      <CitizenDashboard
        onLogout={handleLogout}
        onReportIssue={() => setPage("report")}
      />
    );
  }

  // ================================
  // LOGIN PAGE
  // ================================
  if (page === "login") {
    return (
      <div>

        <Login
          onLoginSuccess={handleLoginSuccess}
        />

        <button
          onClick={() => setPage("home")}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "7px",
            background: "#16834b",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ← Back
        </button>

      </div>
    );
  }

  // ================================
  // REGISTER PAGE
  // ================================
  if (page === "register") {
    return (
      <div>

        <Register />

        <button
          onClick={() => setPage("home")}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "7px",
            background: "#16834b",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ← Back
        </button>

      </div>
    );
  }

  // ================================
  // HOME PAGE
  // ================================
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          Civixa
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#features">
            Features
          </a>

          <button
            className="login-btn"
            onClick={() => setPage("login")}
          >
            Login
          </button>

          <button
            className="register-btn"
            onClick={() => setPage("register")}
          >
            Register
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="hero-tag">
            SMART CIVIC ISSUE MANAGEMENT
          </p>

          <h1>
            Make Your City
            <span>
              {" "}Better Together.
            </span>
          </h1>

          <p className="hero-description">
            Civixa helps citizens report civic problems
            quickly and enables authorities to manage,
            prioritize, and resolve issues efficiently.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => setPage("login")}
            >
              Report an Issue
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Learn More
            </button>

          </div>

        </div>


        <div className="hero-card">

          <div className="card-icon">
            📍
          </div>

          <h3>
            Report Civic Issues
          </h3>

          <p>
            Report potholes, garbage, water leakage,
            streetlight problems and other civic issues.
          </p>

          <div className="issue-status">

            <div>
              <strong>
                24/7
              </strong>

              <span>
                Reporting
              </span>
            </div>

            <div>
              <strong>
                AI
              </strong>

              <span>
                Classification
              </span>
            </div>

            <div>
              <strong>
                Live
              </strong>

              <span>
                Tracking
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about"
        id="about"
      >

        <div className="section-heading">

          <p>
            ABOUT CIVIXA
          </p>

          <h2>
            A smarter way to improve
            <span>
              {" "}our communities.
            </span>
          </h2>

          <p className="section-description">
            Civixa provides a simple digital platform
            where citizens can report civic problems
            and track their progress. The system helps
            authorities organize complaints and respond
            to important issues more effectively.
          </p>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        className="features"
        id="features"
      >

        <div className="section-title">

          <p>
            WHAT CIVIXA OFFERS
          </p>

          <h2>
            Built for citizens.
            <span>
              {" "}Designed for cities.
            </span>
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h3>
              Easy Reporting
            </h3>

            <p>
              Submit civic complaints through a simple
              and user-friendly reporting form.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              Smart Classification
            </h3>

            <p>
              Civixa analyzes the complaint and identifies
              its category and priority.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Complaint Tracking
            </h3>

            <p>
              Citizens can track the status of their
              reported civic issues.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🏢
            </div>

            <h3>
              Department Management
            </h3>

            <p>
              Complaints can be directed to the appropriate
              department for efficient handling.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-it-works">

        <div className="section-title">

          <p>
            HOW IT WORKS
          </p>

          <h2>
            Report. Track.
            <span>
              {" "}Resolve.
            </span>
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Report
            </h3>

            <p>
              Citizens submit details about a civic problem.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Classify
            </h3>

            <p>
              Civixa identifies the issue category and priority.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Assign
            </h3>

            <p>
              The complaint is directed to the responsible department.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Resolve
            </h3>

            <p>
              Authorities update the complaint until it is resolved.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta">

        <div>

          <h2>
            Have a civic issue?
          </h2>

          <p>
            Help make your community better by reporting
            it through Civixa.
          </p>

          <button
            className="primary-btn"
            onClick={() => setPage("login")}
          >
            Report an Issue
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-logo">
          Civixa
        </div>

        <p>
          An AI-Assisted Civic Issue Reporting and
          Management Platform
        </p>

        <p className="copyright">
          © 2026 Civixa. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;