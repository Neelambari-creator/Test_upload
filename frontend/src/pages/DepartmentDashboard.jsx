import { useEffect, useMemo, useState } from "react";

function DepartmentDashboard({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");


  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/complaints/admin/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load complaints.");
        setLoading(false);
        return;
      }

      setComplaints(data.complaints || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to Civixa backend.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================

const updateComplaintStatus = async (complaintId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/complaints/${complaintId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update status.");
      return;
    }

    alert("Complaint status updated successfully.");

    // Reload complaints so the dashboard shows the new status
    fetchComplaints();

  } catch (error) {
    console.error("Status update error:", error);
    alert("Unable to update complaint status.");
  }
};

  // ==========================================
  // STATISTICS
  // ==========================================

  const total = complaints.length;

  const reported = complaints.filter(
    (c) => c.status === "Reported"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const highPriority = complaints.filter(
    (c) => c.priority === "High"
  ).length;

  const mediumPriority = complaints.filter(
    (c) => c.priority === "Medium"
  ).length;

  const lowPriority = complaints.filter(
    (c) => c.priority === "Low"
  ).length;

  // ==========================================
  // FILTER OPTIONS
  // ==========================================

  const categories = [
    "All Categories",
    ...new Set(
      complaints
        .map((c) => c.category)
        .filter(Boolean)
    ),
  ];

  const departments = [
    "All Departments",
    ...new Set(
      complaints
        .map((c) => c.department_name)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.description
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.category
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.location
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.citizen_name
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        complaint.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        complaint.priority === priorityFilter;

      const matchesDepartment =
        departmentFilter === "All Departments" ||
        complaint.department_name === departmentFilter;

      const matchesStatus =
        activeTab === "All" ||
        complaint.status === activeTab;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    complaints,
    search,
    categoryFilter,
    priorityFilter,
    departmentFilter,
    activeTab,
  ]);

  // ==========================================
  // CATEGORY COUNTS
  // ==========================================

  const getCategoryCount = (keyword) => {
    return complaints.filter((c) =>
      c.category
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    ).length;
  };

  // ==========================================
  // CATEGORY ICON
  // ==========================================

  const getCategoryIcon = (category) => {
    const text = category?.toLowerCase() || "";

    if (
      text.includes("road") ||
      text.includes("pothole")
    ) {
      return "🛣️";
    }

    if (
      text.includes("water")
    ) {
      return "🚰";
    }

    if (
      text.includes("waste") ||
      text.includes("garbage")
    ) {
      return "🗑️";
    }

    if (
      text.includes("electric") ||
      text.includes("street")
    ) {
      return "💡";
    }

    if (
      text.includes("drain")
    ) {
      return "🌊";
    }

    return "🏙️";
  };

  // ==========================================
  // PRIORITY STYLE
  // ==========================================

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return {
        background: "#ffe5e5",
        color: "#d93025",
      };
    }

    if (priority === "Medium") {
      return {
        background: "#fff2d6",
        color: "#b77900",
      };
    }

    return {
      background: "#e4f7ec",
      color: "#16834b",
    };
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return {
        background: "#e3f7eb",
        color: "#16834b",
      };
    }

    if (status === "In Progress") {
      return {
        background: "#fff1dc",
        color: "#c27a00",
      };
    }

    return {
      background: "#e7f0ff",
      color: "#2764c4",
    };
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7f6",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        color: "#18332b",
      }}
    >

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "235px",
          background:
            "linear-gradient(180deg,#063f35,#075b49)",
          color: "white",
          padding: "25px 15px",
          boxSizing: "border-box",
          zIndex: 10,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            padding: "5px 15px 30px",
            borderBottom:
              "1px solid rgba(255,255,255,0.12)",
            marginBottom: "25px",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <div
              style={{
                fontSize: "35px",
              }}
            >
              🌿
            </div>

            <div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  letterSpacing: "-1px",
                }}
              >
                Civixa
              </h1>

              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "10px",
                  opacity: 0.8,
                }}
              >
                SMARTER CITIES
              </p>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

<div>

    <p>A Better City Begins with Listening.</p>
    <small>Every citizen complaint is an opportunity to improve the community.</small>
</div>

        {/* BOTTOM BRAND */}

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "20px",
            right: "20px",
            textAlign: "center",
            opacity: 0.7,
            fontSize: "11px",
            lineHeight: "1.5",
          }}
        >
          🌳 🏙️ 🌳
          <br />
          Civic Issue Management
          <br />
          For A Better Tomorrow
        </div>

      </aside>


      {/* ======================================
          MAIN AREA
      ====================================== */}

      <div
        style={{
          marginLeft: "235px",
          minHeight: "100vh",
        }}
      >

        {/* ====================================
            TOP HEADER
        ==================================== */}

        <header
          style={{
            background: "#ffffff",
            padding: "25px 35px",
            borderBottom:
              "1px solid #e3e9e6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                color: "#16372e",
              }}
            >
              Department Dashboard
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#71817b",
                fontSize: "14px",
              }}
            >
              Manage citizen complaints and
              update their status.
            </p>

          </div>


          {/* SEARCH */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >

            <div
              style={{
                background: "#f7f9f8",
                border:
                  "1px solid #e1e8e5",
                borderRadius: "10px",
                padding: "11px 15px",
                width: "280px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >

              <span>
                🔍
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search complaints, location..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "13px",
                }}
              />

            </div>


            <div
              style={{
                fontSize: "23px",
                cursor: "pointer",
              }}
            >
              🔔
            </div>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >

              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#16834b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                👤
              </div>

              <div>

                <strong
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Department Officer
                </strong>

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "11px",
                    color: "#77837f",
                  }}
                >
                  Roads & Infrastructure
                </p>

              </div>

            </div>


            <button
              onClick={onLogout}
              style={{
                border: "none",
                background: "#16834b",
                color: "white",
                padding:
                  "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>

          </div>

        </header>


        {/* ====================================
            CONTENT
        ==================================== */}

        <main
          style={{
            padding: "28px 35px",
          }}
        >

          {/* ==================================
              STAT CARDS
          ================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: "18px",
              marginBottom: "25px",
            }}
          >

            {[
              [
                "📋",
                "Total Complaints",
                total,
                "#e5f7ed",
              ],
              [
                "📄",
                "Reported",
                reported,
                "#e8f0ff",
              ],
              [
                "⏳",
                "In Progress",
                inProgress,
                "#fff3d8",
              ],
              [
                "✓",
                "Resolved",
                resolved,
                "#e1f7e9",
              ],
            ].map(
              (card) => (

                <div
                  key={card[1]}
                  style={{
                    background: "white",
                    border:
                      "1px solid #e2e9e6",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >

                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "12px",
                      background: card[3],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "21px",
                    }}
                  >
                    {card[0]}
                  </div>

                  <div>

                    <p
                      style={{
                        margin: 0,
                        color: "#75827d",
                        fontSize: "12px",
                      }}
                    >
                      {card[1]}
                    </p>

                    <h2
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize: "25px",
                      }}
                    >
                      {card[2]}
                    </h2>

                  </div>

                </div>

              )
            )}

          </div>


          {/* ==================================
              FILTERS
          ================================== */}

          <div
            style={{
              background: "white",
              border:
                "1px solid #e2e9e6",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "18px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              style={selectStyle}
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>


            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              style={selectStyle}
            >

              <option>
                All Priorities
              </option>

              <option>
                High
              </option>

              <option>
                Medium
              </option>

              <option>
                Low
              </option>

            </select>


            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              style={selectStyle}
            >
              {departments.map(
                (department) => (
                  <option
                    key={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>


            <button
              onClick={fetchComplaints}
              style={{
                background:
                  "#16834b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding:
                  "10px 20px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ↻ Refresh
            </button>

          </div>


          {/* ==================================
              STATUS TABS
          ================================== */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "18px",
            }}
          >

            {[
              ["All", total],
              ["Reported", reported],
              ["In Progress", inProgress],
              ["Resolved", resolved],
            ].map(
              ([status, count]) => (

                <button
                  key={status}
                  onClick={() =>
                    setActiveTab(status)
                  }
                  style={{
                    border:
                      activeTab === status
                        ? "none"
                        : "1px solid #dfe6e3",
                    background:
                      activeTab === status
                        ? "#16834b"
                        : "white",
                    color:
                      activeTab === status
                        ? "white"
                        : "#43534d",
                    padding:
                      "10px 18px",
                    borderRadius:
                      "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {status}
                  {" "}
                  ({count})
                </button>

              )
            )}

          </div>


          {/* ==================================
              MAIN GRID
          ================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 280px",
              gap: "20px",
            }}
          >

            {/* =================================
                COMPLAINTS
            ================================= */}

            <section>

              {loading && (
                <div
                  style={emptyStyle}
                >
                  Loading complaints...
                </div>
              )}


              {error && (
                <div
                  style={{
                    ...emptyStyle,
                    color: "#c62828",
                  }}
                >
                  {error}
                </div>
              )}


              {!loading &&
                !error &&
                filteredComplaints.length === 0 && (
                  <div
                    style={emptyStyle}
                  >
                    <div
                      style={{
                        fontSize: "45px",
                      }}
                    >
                      📋
                    </div>

                    <h3>
                      No complaints found
                    </h3>

                    <p>
                      Try changing your
                      filters or search.
                    </p>

                  </div>
                )}


              {!loading &&
                !error &&
                filteredComplaints.map(
                  (complaint) => (

                    <div
                      key={
                        complaint.complaint_id
                      }
                      style={{
                        background: "white",
                        border:
                          "1px solid #e1e8e5",
                        borderRadius: "12px",
                        padding: "18px",
                        marginBottom: "14px",
                        display: "flex",
                        gap: "18px",
                        boxShadow:
                          "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >

                      {/* ICON */}

                      <div
                        style={{
                          width: "62px",
                          height: "62px",
                          borderRadius:
                            "10px",
                          background:
                            "#e7f5ef",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize: "31px",
                          flexShrink: 0,
                        }}
                      >
                        {getCategoryIcon(
                          complaint.category
                        )}
                      </div>


                      {/* CONTENT */}

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "10px",
                          }}
                        >

                          <div>

                            <h3
                              style={{
                                margin: 0,
                                fontSize: "16px",
                                color:
                                  "#183b31",
                              }}
                            >
                              {complaint.category ||
                                "Civic Issue"}
                            </h3>

                            <p
                              style={{
                                margin:
                                  "6px 0",
                                color:
                                  "#66756f",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  "1.5",
                              }}
                            >
                              {
                                complaint.description
                              }
                            </p>

                          </div>


                          <div
                            style={{
                              display:
                                "flex",
                              gap: "7px",
                              flexShrink: 0,
                            }}
                          >

                            <span
                              style={{
                                ...getPriorityStyle(
                                  complaint.priority
                                ),
                                padding:
                                  "5px 11px",
                                borderRadius:
                                  "15px",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "700",
                              }}
                            >
                              {complaint.priority}
                            </span>

                            <span
                              style={{
                                ...getStatusStyle(
                                  complaint.status
                                ),
                                padding:
                                  "5px 11px",
                                borderRadius:
                                  "15px",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              {complaint.status}
                            </span>

                          </div>

                        </div>


                        {/* DETAILS */}

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap: "20px",
                            marginTop:
                              "12px",
                            fontSize:
                              "11px",
                            color:
                              "#61716b",
                          }}
                        >

                          <span>
                            🏢{" "}
                            {complaint.department_name ||
                              "Not Assigned"}
                          </span>

                          <span>
                            📍{" "}
                            {complaint.location ||
                              "Location not provided"}
                          </span>

                          <span>
                            👤{" "}
                            {complaint.citizen_name ||
                              "Citizen"}
                          </span>

                          <span>
                            📅{" "}
                            {formatDate(
                              complaint.created_at
                            )}
                          </span>

                        </div>


                        {/* AI LABEL */}

                        <div
                          style={{
                            marginTop:
                              "12px",
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "6px",
                            background:
                              "#f0faf5",
                            color:
                              "#16834b",
                            padding:
                              "5px 9px",
                            borderRadius:
                              "6px",
                            fontSize:
                              "10px",
                            fontWeight:
                              "600",
                          }}
                        >
                          🤖 AI Classified
                        </div>
                        <div
  style={{
    marginTop: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <select
    value={complaint.status}
    onChange={(e) => {
      complaint.selectedStatus = e.target.value;
    }}
    style={{
      padding: "8px 10px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "13px",
    }}
  >
    <option value="Reported">Reported</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>

  <button
    onClick={() =>
      updateComplaintStatus(
        complaint.complaint_id,
        complaint.selectedStatus || complaint.status
      )
    }
    style={{
      padding: "8px 14px",
      background: "#16834b",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Update Status
  </button>
</div>



                      </div>


                      {/* ID */}

                      <div
                        style={{
                          color:
                            "#87938e",
                          fontSize:
                            "11px",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        #CP-
                        {String(
                          complaint.complaint_id
                        ).padStart(
                          4,
                          "0"
                        )}
                      </div>

                    </div>

                  )
                )}

            </section>


            {/* =================================
                RIGHT SIDEBAR
            ================================= */}

            <aside>

              {/* AI CLASSIFICATION */}

              <div
                style={sideCardStyle}
              >

                <h3
                  style={{
                    margin:
                      "0 0 5px",
                    fontSize:
                      "15px",
                  }}
                >
                  🤖 AI Classification
                </h3>

                <p
                  style={{
                    margin:
                      "0 0 15px",
                    fontSize:
                      "10px",
                    color:
                      "#77847f",
                  }}
                >
                  Smart complaint classification
                </p>


                {[
                  [
                    "🛣️",
                    "Pothole / Road Damage",
                    getCategoryCount(
                      "Road"
                    ),
                  ],
                  [
                    "🚰",
                    "Water Leakage",
                    getCategoryCount(
                      "Water"
                    ),
                  ],
                  [
                    "🗑️",
                    "Garbage / Waste",
                    getCategoryCount(
                      "Waste"
                    ),
                  ],
                  [
                    "💡",
                    "Streetlight",
                    getCategoryCount(
                      "Electrical"
                    ),
                  ],
                  [
                    "🌊",
                    "Drainage",
                    getCategoryCount(
                      "Drain"
                    ),
                  ],
                ].map(
                  ([icon, name, count]) => (

                    <div
                      key={name}
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "9px",
                        marginBottom:
                          "13px",
                      }}
                    >

                      <span
                        style={{
                          fontSize:
                            "18px",
                        }}
                      >
                        {icon}
                      </span>

                      <span
                        style={{
                          flex: 1,
                          fontSize:
                            "11px",
                        }}
                      >
                        {name}
                      </span>

                      <strong
                        style={{
                          fontSize:
                            "11px",
                          color:
                            "#16834b",
                        }}
                      >
                        {count}
                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* PRIORITY */}

              <div
                style={sideCardStyle}
              >

                <h3
                  style={{
                    margin:
                      "0 0 15px",
                    fontSize:
                      "15px",
                  }}
                >
                  🎯 Priority Overview
                </h3>


                {[
                  [
                    "High",
                    highPriority,
                    "#e53935",
                  ],
                  [
                    "Medium",
                    mediumPriority,
                    "#f5a623",
                  ],
                  [
                    "Low",
                    lowPriority,
                    "#26a269",
                  ],
                ].map(
                  ([name, count, color]) => {

                    const percentage =
                      total > 0
                        ? Math.round(
                            (count /
                              total) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={name}
                        style={{
                          marginBottom:
                            "14px",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            fontSize:
                              "11px",
                            marginBottom:
                              "5px",
                          }}
                        >

                          <span>
                            {name}
                          </span>

                          <strong>
                            {count}{" "}
                            ({percentage}%)
                          </strong>

                        </div>

                        <div
                          style={{
                            height:
                              "7px",
                            background:
                              "#edf1ef",
                            borderRadius:
                              "10px",
                          }}
                        >

                          <div
                            style={{
                              width:
                                `${percentage}%`,
                              height:
                                "100%",
                              background:
                                color,
                              borderRadius:
                                "10px",
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>


              {/* QUICK SUMMARY */}

              <div
                style={{
                  ...sideCardStyle,
                  background:
                    "linear-gradient(135deg,#063f35,#087452)",
                  color: "white",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "25px",
                    marginBottom:
                      "10px",
                  }}
                >
                  🏙️
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 7px",
                    fontSize:
                      "15px",
                  }}
                >
                  Civic Performance
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize:
                      "11px",
                    opacity:
                      0.8,
                    lineHeight:
                      "1.5",
                  }}
                >
                  Keep monitoring citizen
                  complaints and resolve
                  high-priority issues quickly.
                </p>

              </div>

            </aside>

          </div>

        </main>

      </div>

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const selectStyle = {
  padding: "10px 13px",
  border: "1px solid #dfe7e3",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#40514a",
  outline: "none",
  fontSize: "12px",
  minWidth: "160px",
};

const emptyStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e1e8e5",
  padding: "60px 20px",
  textAlign: "center",
  color: "#75827d",
};

const sideCardStyle = {
  background: "#ffffff",
  border: "1px solid #e1e8e5",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "18px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.03)",
};

export default DepartmentDashboard;