import { useState, useEffect } from "react";
import "./Dashboard.css";

function CitizenDashboard({ onLogout, onReportIssue }) {

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inProgress: 0,
    resolved: 0
  });

  const [complaints, setComplaints] = useState([]);
  const [feedbackRatings, setFeedbackRatings] = useState({});
const [feedbackTexts, setFeedbackTexts] = useState({});
const [feedbackSubmitted, setFeedbackSubmitted] = useState({});
const [feedbackLoading, setFeedbackLoading] = useState({});

  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const [complaintFilter, setComplaintFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Citizen",
    email: ""
  };

  const firstName = user.name
    ? user.name.split(" ")[0]
    : "Citizen";


  // =====================================================
  // FETCH STATISTICS
  // =====================================================

  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/complaints/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {

        setStats({
          total: Number(data.total) || 0,
          active: Number(data.active) || 0,
          inProgress: Number(data.inProgress) || 0,
          resolved: Number(data.resolved) || 0
        });

      } else {

        console.error(
          "Failed to fetch statistics:",
          data.message
        );

      }

    } catch (error) {

      console.error(
        "Error fetching statistics:",
        error
      );

    }

  };


  // =====================================================
  // FETCH COMPLAINTS
  // =====================================================

  const fetchComplaints = async () => {

    try {

      setLoadingComplaints(true);

      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {

        setComplaints(data.complaints || []);

      } else {

        console.error(
          "Failed to fetch complaints:",
          data.message
        );

      }

    } catch (error) {

      console.error(
        "Error fetching complaints:",
        error
      );

    } finally {

      setLoadingComplaints(false);

    }

  };

// =====================================================
// SUBMIT FEEDBACK
// =====================================================

const submitFeedback = async (complaintId) => {

  try {

    const token = localStorage.getItem("token");

    const rating = feedbackRatings[complaintId];
    const feedback_text = feedbackTexts[complaintId] || "";

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setFeedbackLoading((prev) => ({
      ...prev,
      [complaintId]: true
    }));

    const response = await fetch(
      `http://localhost:5000/api/complaints/${complaintId}/feedback`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          rating,
          feedback_text
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      setFeedbackSubmitted((prev) => ({
        ...prev,
        [complaintId]: true
      }));

      alert("Thank you! Your feedback has been submitted.");

    } else {

      alert(
        data.message || "Failed to submit feedback."
      );

    }

  } catch (error) {

    console.error(
      "Feedback submission error:",
      error
    );

    alert(
      "Unable to submit feedback."
    );

  } finally {

    setFeedbackLoading((prev) => ({
      ...prev,
      [complaintId]: false
    }));

  }

};
  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    fetchStats();
    fetchComplaints();

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    if (status === "Resolved") {
      return "resolved";
    }

    if (status === "In Progress") {
      return "in-progress";
    }

    return "reported";

  };


  // =====================================================
  // PRIORITY CLASS
  // =====================================================

  const getPriorityClass = (priority) => {

    if (priority === "High") {
      return "high";
    }

    if (priority === "Low") {
      return "low";
    }

    return "medium";

  };


  // =====================================================
  // FILTER COMPLAINTS
  // =====================================================

  const filteredComplaints = complaints.filter(
    (complaint) => {

      if (complaintFilter === "active") {

        return (
          complaint.status === "Reported" ||
          complaint.status === "In Progress"
        );

      }

      if (complaintFilter === "resolved") {

        return complaint.status === "Resolved";

      }

      return true;

    }
  );


  // =====================================================
  // DASHBOARD
  // =====================================================

  const renderDashboard = () => {

    return (
      <>

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <p className="welcome-label">
              CITIZEN DASHBOARD
            </p>

            <h1>
              Good day, {firstName} 👋
            </h1>

            <p>
              Welcome back. Here's an overview of
              your civic activity with Civixa.
            </p>

          </div>


          <button
            className="report-button"
            onClick={onReportIssue}
            type="button"
          >

            <span>＋</span>

            Report an Issue

          </button>

        </section>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="stats-grid">


          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon green">
                ▤
              </div>

              <span className="stat-change">
                All time
              </span>

            </div>

            <p>
              Total Complaints
            </p>

            <h2>
              {stats.total}
            </h2>

            <div className="stat-footer">
              Your reported civic issues
            </div>

          </div>


          {/* ACTIVE */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon orange">
                ◷
              </div>

              <span className="stat-change">
                Active
              </span>

            </div>

            <p>
              Active Complaints
            </p>

            <h2>
              {stats.active}
            </h2>

            <div className="stat-footer">
              Issues being handled
            </div>

          </div>


          {/* RESOLVED */}

          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon blue">
                ✓
              </div>

              <span className="stat-change">
                Completed
              </span>

            </div>

            <p>
              Resolved Complaints
            </p>

            <h2>
              {stats.resolved}
            </h2>

            <div className="stat-footer">
              Successfully resolved
            </div>

          </div>


          {/* =================================================
              AI CLASSIFICATION - NOW CLICKABLE
          ================================================= */}

          <button
            className="stat-card ai-stat-card"
            onClick={() => setActiveMenu("ai")}
            type="button"
          >

            <div className="stat-card-top">

              <div className="stat-icon purple">
                ⚡
              </div>

              <span className="stat-change">
                Civixa AI
              </span>

            </div>

            <p>
              AI Classification
            </p>

            <h2>
              AI
            </h2>

            <div className="stat-footer">
              Click to view AI analysis
            </div>

          </button>

        </section>


        {/* DASHBOARD GRID */}

        <section className="dashboard-grid">


          {/* QUICK REPORT */}

          <div className="quick-report-card">

            <div className="card-heading">

              <div>

                <p className="card-label">
                  QUICK ACTION
                </p>

                <h2>
                  Report a civic issue
                </h2>

                <p>
                  Help improve your community by
                  reporting a problem you noticed.
                </p>

              </div>

              <div className="large-report-icon">
                ＋
              </div>

            </div>


            <div className="issue-types">

              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>🛣️</span>
                <p>Road Damage</p>
              </button>


              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>🗑️</span>
                <p>Garbage</p>
              </button>


              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>💡</span>
                <p>Streetlight</p>
              </button>


              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>💧</span>
                <p>Water Leakage</p>
              </button>


              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>🚰</span>
                <p>Drainage</p>
              </button>


              <button
                className="issue-type"
                onClick={onReportIssue}
                type="button"
              >
                <span>⚡</span>
                <p>Electrical</p>
              </button>

            </div>


            <button
              className="quick-report-button"
              onClick={onReportIssue}
              type="button"
            >

              Start a Report

              <span>
                →
              </span>

            </button>

          </div>


          {/* PROFILE */}

          <div className="profile-summary-card">

            <div className="profile-card-header">

              <h3>
                Your Profile
              </h3>

              <button
                onClick={() => setActiveMenu("profile")}
                type="button"
              >
                View
              </button>

            </div>


            <div className="large-avatar">

              {firstName.charAt(0).toUpperCase()}

            </div>


            <h3 className="profile-name">
              {user.name}
            </h3>


            <p className="profile-email">
              {user.email}
            </p>


            <div className="profile-status">

              <span></span>

              Active Citizen

            </div>


            <div className="profile-divider"></div>


            <div className="profile-detail">

              <span>
                Account type
              </span>

              <strong>
                Citizen
              </strong>

            </div>


            <div className="profile-detail">

              <span>
                Total Complaints
              </span>

              <strong>
                {stats.total}
              </strong>

            </div>

          </div>

        </section>


        {/* RECENT COMPLAINTS */}

        <section className="complaints-card">

          <div className="complaints-header">

            <div>

              <p className="card-label">
                ACTIVITY
              </p>

              <h2>
                Recent Complaints
              </h2>

            </div>


            <button
              className="view-all-button"
              onClick={() => {

                setComplaintFilter("all");
                setActiveMenu("complaints");

              }}
              type="button"
            >
              View all →
            </button>

          </div>


          {loadingComplaints ? (

            <div className="empty-state">

              <div className="empty-icon">
                ◷
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while Civixa retrieves
                your complaints.
              </p>

            </div>

          ) : complaints.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ▤
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                You haven't reported any civic issues.
              </p>

              <button
                onClick={onReportIssue}
                className="empty-action"
                type="button"
              >
                Report your first issue →
              </button>

            </div>

          ) : (

            <div className="recent-complaints-list">

              {complaints
                .slice(0, 3)
                .map((complaint) => (

                  <div
                    className="complaint-row"
                    key={complaint.complaint_id}
                  >

                    <div className="complaint-row-main">

                      <strong>
                        {complaint.category ||
                          "General Civic Issue"}
                      </strong>

                      <p>
                        {complaint.description}
                      </p>

                      <span>
                        📍 {complaint.location}
                      </span>

                    </div>


                    <div className="complaint-row-info">

                      <span
                        className={`priority-badge ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority || "Medium"}
                      </span>


                      <span
                        className={`status-badge ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {complaint.status || "Reported"}
                      </span>


                      <small>
                        {formatDate(
                          complaint.created_at
                        )}
                      </small>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* CIVIXA AI INFORMATION */}

        <section className="civixa-tip">

          <div className="tip-icon">
            ✦
          </div>


          <div>

            <strong>
              Civixa AI Smart Classification
            </strong>

            <p>
              Civixa analyzes your complaint description
              and automatically identifies the appropriate
              category, priority level and responsible
              department.
            </p>

          </div>

        </section>

      </>
    );

  };


  // =====================================================
  // AI CLASSIFICATION PAGE
  // =====================================================

  const renderAIClassification = () => {

    return (

      <section className="complaints-card">

        <div className="complaints-header">

          <div>

            <p className="card-label">
              CIVIXA INTELLIGENCE
            </p>

            <h2>
              AI Classification
            </h2>

            <p>
              View how Civixa AI classified your
              reported civic issues.
            </p>

          </div>


          <button
            className="view-all-button"
            onClick={() => setActiveMenu("dashboard")}
            type="button"
          >
            ← Dashboard
          </button>

        </div>


        {/* AI EXPLANATION */}

        <div className="ai-classification-box">

          <div className="ai-classification-title">

            <span>
              ⚡
            </span>

            <strong>
              How Civixa AI works
            </strong>

          </div>

          <p>
            Civixa analyzes the words and meaning in
            your complaint description and assigns a
            suitable category, priority level and
            responsible department.
          </p>

        </div>


        {/* NO COMPLAINTS */}

        {complaints.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⚡
            </div>

            <h3>
              No AI classifications yet
            </h3>

            <p>
              Submit a civic complaint and Civixa AI
              will classify it automatically.
            </p>

            <button
              onClick={onReportIssue}
              className="empty-action"
              type="button"
            >
              Report an Issue →
            </button>

          </div>

        ) : (

          <div className="complaints-list">

            {complaints.map((complaint) => (

              <div
                className="complaint-detail-card"
                key={complaint.complaint_id}
              >

                {/* COMPLAINT HEADER */}

                <div className="complaint-detail-header">

                  <div>

                    <span className="complaint-id">
                      Complaint #{complaint.complaint_id}
                    </span>

                    <h3>
                      {complaint.category ||
                        "General Civic Issue"}
                    </h3>

                  </div>


                  <span
                    className={`priority-badge ${getPriorityClass(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority || "Medium"}
                  </span>

                </div>


                {/* ORIGINAL DESCRIPTION */}

                <div>

                  <span className="card-label">
                    COMPLAINT DESCRIPTION
                  </span>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                </div>


                {/* AI RESULT */}

                <div className="ai-classification-box">

                  <div className="ai-classification-title">

                    <span>
                      ✦
                    </span>

                    <strong>
                      AI Classification Result
                    </strong>

                  </div>


                  <div className="ai-classification-grid">


                    {/* CATEGORY */}

                    <div>

                      <span>
                        Category
                      </span>

                      <strong>
                        {complaint.category ||
                          "Not classified"}
                      </strong>

                    </div>


                    {/* PRIORITY */}

                    <div>

                      <span>
                        Priority
                      </span>

                      <strong
                        className={`priority-text ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority ||
                          "Medium"}
                      </strong>

                    </div>


                    {/* DEPARTMENT */}

                    <div>

                      <span>
                        Responsible Department
                      </span>

                      <strong>
                        {complaint.department_name ||
                          "Public Works Department"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* OTHER DETAILS */}

                <div className="complaint-details-grid">

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      📍 {complaint.location}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Status
                    </span>

                    <strong>
                      {complaint.status || "Reported"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Reported On
                    </span>

                    <strong>
                      {formatDate(
                        complaint.created_at
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Complaint ID
                    </span>

                    <strong>
                      #{complaint.complaint_id}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    );

  };


  // =====================================================
  // MY COMPLAINTS
  // =====================================================

  const renderComplaints = () => {

    return (

      <section className="complaints-card">

        <div className="complaints-header">

          <div>

            <p className="card-label">
              CITIZEN ACTIVITY
            </p>

            <h2>
              My Complaints
            </h2>

            <p>
              Manage and monitor all complaints
              reported by you.
            </p>

          </div>


          <button
            className="view-all-button"
            onClick={() => setActiveMenu("dashboard")}
            type="button"
          >
            ← Dashboard
          </button>

        </div>


        {/* FILTER BUTTONS */}

        <div className="complaint-filters">

          <button
            className={
              complaintFilter === "all"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setComplaintFilter("all")}
            type="button"
          >
            All
            <span>
              {complaints.length}
            </span>
          </button>


          <button
            className={
              complaintFilter === "active"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setComplaintFilter("active")}
            type="button"
          >
            Active
            <span>
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status === "Reported" ||
                    complaint.status === "In Progress"
                ).length
              }
            </span>
          </button>


          <button
            className={
              complaintFilter === "resolved"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setComplaintFilter("resolved")}
            type="button"
          >
            Resolved
            <span>
              {
                complaints.filter(
                  (complaint) =>
                    complaint.status === "Resolved"
                ).length
              }
            </span>
          </button>

        </div>


        {/* COMPLAINT LIST */}

        {loadingComplaints ? (

          <div className="empty-state">

            <div className="empty-icon">
              ◷
            </div>

            <h3>
              Loading complaints...
            </h3>

            <p>
              Please wait while Civixa retrieves
              your complaints.
            </p>

          </div>

        ) : filteredComplaints.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ▤
            </div>

            <h3>
              No complaints found
            </h3>

            <p>
              There are no complaints in this category.
            </p>

            <button
              onClick={onReportIssue}
              className="empty-action"
              type="button"
            >
              Report an Issue →
            </button>

          </div>

        ) : (

          <div className="complaints-list">

            {filteredComplaints.map((complaint) => (

              <div
                className="complaint-detail-card"
                key={complaint.complaint_id}
              >

                <div className="complaint-detail-header">

                  <div>

                    <span className="complaint-id">
                      Complaint #{complaint.complaint_id}
                    </span>

                    <h3>
                      {complaint.category ||
                        "General Civic Issue"}
                    </h3>

                  </div>


                  <span
                    className={`status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status || "Reported"}
                  </span>

                </div>


                <p className="complaint-description">
                  {complaint.description}
                </p>


                {/* AI CLASSIFICATION */}

                <div className="ai-classification-box">

                  <div className="ai-classification-title">

                    <span>
                      ⚡
                    </span>

                    <strong>
                      Civixa AI Classification
                    </strong>

                  </div>


                  <div className="ai-classification-grid">

                    <div>

                      <span>
                        Category
                      </span>

                      <strong>
                        {complaint.category ||
                          "Not classified"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Priority
                      </span>

                      <strong
                        className={`priority-text ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority ||
                          "Medium"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Department
                      </span>

                      <strong>
                        {complaint.department_name ||
                          "Public Works Department"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="complaint-details-grid">

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      📍 {complaint.location}
                    </strong>

                  </div>
                  {/* FEEDBACK */}

{complaint.status === "Resolved" && (

  <div className="feedback-section">

    <div className="feedback-header">

      <span className="card-label">
        CITIZEN FEEDBACK
      </span>

      <h3>
        How was your issue resolved?
      </h3>

      <p>
        Your feedback helps Civixa improve civic services.
      </p>

    </div>


    {feedbackSubmitted[complaint.complaint_id] ? (

      <div className="feedback-success">

        <span>
          ✓
        </span>

        <div>

          <strong>
            Thank you for your feedback!
          </strong>

          <p>
            Your feedback has been successfully submitted.
          </p>

        </div>

      </div>

    ) : (

      <>

        {/* STAR RATING */}

        <div className="feedback-rating">

          <span>
            Rating
          </span>

          <div className="stars">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() =>
                  setFeedbackRatings((prev) => ({
                    ...prev,
                    [complaint.complaint_id]: star
                  }))
                }
                className={
                  feedbackRatings[complaint.complaint_id] >= star
                    ? "star selected"
                    : "star"
                }
              >
                ★
              </button>

            ))}

          </div>

        </div>


        {/* FEEDBACK TEXT */}

        <textarea
          className="feedback-textarea"
          placeholder="Tell us about your experience..."
          value={
            feedbackTexts[complaint.complaint_id] || ""
          }
          onChange={(e) =>
            setFeedbackTexts((prev) => ({
              ...prev,
              [complaint.complaint_id]: e.target.value
            }))
          }
        />


        {/* SUBMIT */}

        <button
          type="button"
          className="feedback-submit-button"
          onClick={() =>
            submitFeedback(complaint.complaint_id)
          }
          disabled={
            feedbackLoading[complaint.complaint_id]
          }
        >

          {feedbackLoading[complaint.complaint_id]
            ? "Submitting..."
            : "Submit Feedback →"}

        </button>

      </>

    )}

  </div>

)}



                  <div>

                    <span>
                      Reported On
                    </span>

                    <strong>
                      {formatDate(
                        complaint.created_at
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Status
                    </span>

                    <strong>
                      {complaint.status || "Reported"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Complaint ID
                    </span>

                    <strong>
                      #{complaint.complaint_id}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    );

  };


  // =====================================================
  // TRACK ISSUES
  // =====================================================

  const renderTracking = () => {

    return (

      <section className="complaints-card">

        <div className="complaints-header">

          <div>

            <p className="card-label">
              ISSUE TRACKING
            </p>

            <h2>
              Track Issues
            </h2>

            <p>
              Track the progress of your reported
              civic issues.
            </p>

          </div>


          <button
            className="view-all-button"
            onClick={() => setActiveMenu("dashboard")}
            type="button"
          >
            ← Dashboard
          </button>

        </div>


        {loadingComplaints ? (

          <div className="empty-state">

            <h3>
              Loading issues...
            </h3>

          </div>

        ) : complaints.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⌖
            </div>

            <h3>
              No issues to track
            </h3>

            <p>
              Once you report a civic issue, you can
              track its progress here.
            </p>

            <button
              onClick={onReportIssue}
              className="empty-action"
              type="button"
            >
              Report an Issue →
            </button>

          </div>

        ) : (

          <div className="tracking-list">

            {complaints.map((complaint) => (

              <div
                className="complaint-detail-card"
                key={complaint.complaint_id}
              >

                <div className="complaint-detail-header">

                  <div>

                    <span className="complaint-id">
                      Complaint #{complaint.complaint_id}
                    </span>

                    <h3>
                      {complaint.category ||
                        "General Civic Issue"}
                    </h3>

                  </div>


                  <span
                    className={`status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status || "Reported"}
                  </span>

                </div>


                <p className="complaint-description">
                  {complaint.description}
                </p>


                {/* TRACKING PROGRESS */}

                <div className="tracking-progress">


                  {/* REPORTED */}

                  <div className="tracking-step completed">

                    <span>
                      ✓
                    </span>

                    <div>

                      <strong>
                        Reported
                      </strong>

                      <small>
                        Complaint submitted to Civixa
                      </small>

                    </div>

                  </div>


                  {/* IN PROGRESS */}

                  <div
                    className={`tracking-step ${
                      complaint.status === "In Progress" ||
                      complaint.status === "Resolved"
                        ? "completed"
                        : ""
                    }`}
                  >

                    <span>

                      {complaint.status === "In Progress" ||
                      complaint.status === "Resolved"
                        ? "✓"
                        : "2"}

                    </span>


                    <div>

                      <strong>
                        In Progress
                      </strong>

                      <small>
                        Department is handling the issue
                      </small>

                    </div>

                  </div>


                  {/* RESOLVED */}

                  <div
                    className={`tracking-step ${
                      complaint.status === "Resolved"
                        ? "completed"
                        : ""
                    }`}
                  >

                    <span>

                      {complaint.status === "Resolved"
                        ? "✓"
                        : "3"}

                    </span>


                    <div>

                      <strong>
                        Resolved
                      </strong>

                      <small>
                        Issue has been successfully resolved
                      </small>

                    </div>

                  </div>

                </div>


                {/* TRACKING DETAILS */}

                <div className="complaint-details-grid">

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      📍 {complaint.location}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Department
                    </span>

                    <strong>
                      {complaint.department_name ||
                        "Public Works Department"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Priority
                    </span>

                    <strong
                      className={`priority-text ${getPriorityClass(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority || "Medium"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Reported On
                    </span>

                    <strong>
                      {formatDate(
                        complaint.created_at
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    );

  };


  // =====================================================
  // PROFILE
  // =====================================================

  const renderProfile = () => {

    return (

      <section className="complaints-card">

        <div className="complaints-header">

          <div>

            <p className="card-label">
              ACCOUNT
            </p>

            <h2>
              My Profile
            </h2>

          </div>


          <button
            className="view-all-button"
            onClick={() => setActiveMenu("dashboard")}
            type="button"
          >
            ← Dashboard
          </button>

        </div>


        <div className="profile-summary-card">

          <div className="large-avatar">

            {firstName.charAt(0).toUpperCase()}

          </div>


          <h3 className="profile-name">
            {user.name}
          </h3>


          <p className="profile-email">
            {user.email}
          </p>


          <div className="profile-status">

            <span></span>

            Active Citizen

          </div>


          <div className="profile-divider"></div>


          <div className="profile-detail">

            <span>
              Account type
            </span>

            <strong>
              Citizen
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Total Complaints
            </span>

            <strong>
              {stats.total}
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Active Complaints
            </span>

            <strong>
              {stats.active}
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Resolved
            </span>

            <strong>
              {stats.resolved}
            </strong>

          </div>

        </div>

      </section>

    );

  };


  // =====================================================
  // CONTENT SELECTION
  // =====================================================

  const renderContent = () => {

    if (activeMenu === "complaints") {
      return renderComplaints();
    }

    if (activeMenu === "tracking") {
      return renderTracking();
    }

    if (activeMenu === "profile") {
      return renderProfile();
    }

    if (activeMenu === "ai") {
      return renderAIClassification();
    }

    return renderDashboard();

  };


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="dashboard">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="dashboard-logo">

          <div className="dashboard-logo-mark">
            C
          </div>

          <span>
            Civixa
          </span>

        </div>


        {/* MAIN MENU */}

        <div className="sidebar-section">

          <p className="sidebar-label">
            MAIN MENU
          </p>


          {/* DASHBOARD */}

          <button
            className={`sidebar-item ${
              activeMenu === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("dashboard")
            }
            type="button"
          >

            <span className="sidebar-icon">
              ⌂
            </span>

            Dashboard

          </button>


          {/* REPORT ISSUE */}

          <button
            className="sidebar-item"
            onClick={onReportIssue}
            type="button"
          >

            <span className="sidebar-icon">
              ＋
            </span>

            Report an Issue

          </button>


          {/* MY COMPLAINTS */}

          <button
            className={`sidebar-item ${
              activeMenu === "complaints"
                ? "active"
                : ""
            }`}
            onClick={() => {

              setComplaintFilter("all");
              setActiveMenu("complaints");

            }}
            type="button"
          >

            <span className="sidebar-icon">
              ▤
            </span>

            My Complaints

          </button>


          {/* TRACK ISSUES */}

          <button
            className={`sidebar-item ${
              activeMenu === "tracking"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("tracking")
            }
            type="button"
          >

            <span className="sidebar-icon">
              ⌖
            </span>

            Track Issues

          </button>


          {/* AI CLASSIFICATION */}

          <button
            className={`sidebar-item ${
              activeMenu === "ai"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("ai")
            }
            type="button"
          >

            <span className="sidebar-icon">
              ⚡
            </span>

            AI Classification

          </button>


          {/* MY PROFILE */}

          <button
            className={`sidebar-item ${
              activeMenu === "profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("profile")
            }
            type="button"
          >

            <span className="sidebar-icon">
              ◎
            </span>

            My Profile

          </button>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="sidebar-item logout-item"
            onClick={onLogout}
            type="button"
          >

            <span className="sidebar-icon">
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main">

        {renderContent()}

      </main>

    </div>

  );

}


export default CitizenDashboard;