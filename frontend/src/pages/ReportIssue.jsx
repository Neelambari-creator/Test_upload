
import { useState } from "react";
import "./ReportIssue.css";

function ReportIssue({ onBack }) {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again before submitting a complaint.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: description,
            location: location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit complaint.");
        setLoading(false);
        return;
      }

      console.log("Complaint submitted:", data);

      setMessage(
        "Complaint submitted successfully! Civixa has classified your issue."
      );

      setDescription("");
      setLocation("");

    } catch (error) {
      console.error("Complaint submission error:", error);

      setError(
        "Unable to connect to the Civixa server. Make sure the backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="report-page">

      {/* HEADER */}

      <header className="report-header">

        <div className="report-brand">

          <div className="report-brand-mark">
            C
          </div>

          <span>
            Civixa
          </span>

        </div>


        <div className="report-header-text">

          <span>
            CITIZEN PORTAL
          </span>

          <h1>
            Report a Civic Issue
          </h1>

        </div>


        <button
          className="report-back-button"
          onClick={onBack}
          type="button"
        >
          ← Back to Dashboard
        </button>

      </header>


      {/* MAIN CONTENT */}

      <main className="report-content">

        <div className="report-intro">

          <p className="report-label">
            MAKE A DIFFERENCE
          </p>

          <h2>
            Tell us what needs
            <span> attention.</span>
          </h2>

          <p>
            Describe the civic problem you noticed.
            Civixa will analyze your complaint and
            help identify the appropriate category,
            priority and department.
          </p>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#e8f7ee",
              color: "#18794e",
              border: "1px solid #b7e4c7",
              fontWeight: "600",
            }}
          >
            ✓ {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div
            style={{
              padding: "14px 18px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#fff0f0",
              color: "#c62828",
              border: "1px solid #f3b5b5",
              fontWeight: "600",
            }}
          >
            ⚠ {error}
          </div>
        )}


        {/* FORM CARD */}

        <form
          className="report-form-card"
          onSubmit={handleSubmit}
        >

          {/* DESCRIPTION */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="form-number">
                01
              </div>

              <div>

                <h3>
                  Describe the issue
                </h3>

                <p>
                  Provide enough details so the issue
                  can be understood clearly.
                </p>

              </div>

            </div>


            <div className="report-input-group">

              <label>
                Complaint description
                <span>*</span>
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Example: There is a large pothole near our college entrance. It is causing difficulty for two-wheelers and could lead to accidents."
                rows="6"
                maxLength="1000"
                required
              />

              <div className="character-count">
                {description.length} / 1000 characters
              </div>

            </div>

          </div>


          {/* LOCATION */}

          <div className="form-section">

            <div className="form-section-heading">

              <div className="form-number">
                02
              </div>

              <div>

                <h3>
                  Where is the issue?
                </h3>

                <p>
                  Enter the location where the problem
                  was observed.
                </p>

              </div>

            </div>


            <div className="report-input-group">

              <label>
                Location
                <span>*</span>
              </label>

              <div className="location-input-wrapper">

                <span className="location-icon">
                  📍
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Enter street, area or landmark"
                  required
                />

              </div>

              <p className="input-help">
                Example: Near Bapuji College,
                Davangere
              </p>

            </div>

          </div>


          {/* AI INFORMATION */}

          <div className="ai-preview">

            <div className="ai-preview-icon">
              ✦
            </div>

            <div>

              <strong>
                Civixa Smart Classification
              </strong>

              <p>
                After submission, Civixa will analyze
                your complaint to determine the issue
                category, priority level and responsible
                department.
              </p>

            </div>

          </div>


          {/* SUBMIT */}

          <div className="report-form-footer">

            <p>
              <span>*</span>
              Required fields
            </p>

            <button
              type="submit"
              className="submit-report-button"
              disabled={loading}
            >

              {loading
                ? "Submitting..."
                : "Submit Report"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default ReportIssue;

