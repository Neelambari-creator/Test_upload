const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");


// =====================================================
// CIVIXA SMART CLASSIFICATION
// =====================================================

function classifyComplaint(description) {

    const text = description.toLowerCase().trim();


    // =====================================================
    // WATER SUPPLY
    // =====================================================

    if (
        text.includes("water") ||
        text.includes("water leakage") ||
        text.includes("water leak") ||
        text.includes("pipeline") ||
        text.includes("pipe leakage") ||
        text.includes("pipe leak") ||
        text.includes("no water") ||
        text.includes("water shortage") ||
        text.includes("water supply") ||
        text.includes("tap water")
    ) {
        return {
            category: "Water Supply",
            priority: "High",
            department: "Water Supply"
        };
    }


    // =====================================================
    // DRAINAGE / SEWAGE
    // =====================================================

    if (
        text.includes("drain") ||
        text.includes("drainage") ||
        text.includes("sewage") ||
        text.includes("sewer") ||
        text.includes("blocked drain") ||
        text.includes("drain blockage") ||
        text.includes("sewer blockage")
    ) {
        return {
            category: "Drainage",
            priority: "High",
            department: "Drainage Department"
        };
    }


    // =====================================================
    // ELECTRICAL / STREETLIGHT
    // =====================================================

    if (
        text.includes("streetlight") ||
        text.includes("street light") ||
        text.includes("lamp") ||
        text.includes("bulb") ||
        text.includes("electric") ||
        text.includes("electricity") ||
        text.includes("power cut") ||
        text.includes("power failure") ||
        text.includes("power outage") ||
        text.includes("wire") ||
        text.includes("transformer")
    ) {
        return {
            category: "Electrical Issue",
            priority: "High",
            department: "Electrical Department"
        };
    }


    // =====================================================
    // GARBAGE / WASTE
    // =====================================================

    if (
        text.includes("garbage") ||
        text.includes("waste") ||
        text.includes("trash") ||
        text.includes("dustbin") ||
        text.includes("dump") ||
        text.includes("litter") ||
        text.includes("garbage collection") ||
        text.includes("waste collection")
    ) {
        return {
            category: "Waste Management",
            priority: "Medium",
            department: "Waste Management"
        };
    }


    // =====================================================
    // ROAD / INFRASTRUCTURE
    // =====================================================

    if (
        text.includes("pothole") ||
        text.includes("road damage") ||
        text.includes("damaged road") ||
        text.includes("broken road") ||
        text.includes("road") ||
        text.includes("footpath") ||
        text.includes("pavement") ||
        text.includes("bridge") ||
        text.includes("sidewalk") ||
        text.includes("road crack")
    ) {
        return {
            category: "Road Damage",
            priority: "High",
            department: "Roads & Infrastructure"
        };
    }


    // =====================================================
    // DEFAULT CIVIC ISSUE
    // =====================================================

    return {
        category: "General Civic Issue",
        priority: "Medium",
        department: "Public Works Department"
    };
}


// =====================================================
// SUBMIT NEW COMPLAINT
// =====================================================

router.post("/", authMiddleware, (req, res) => {

    const userId = req.user.user_id;

    const {
        description,
        location
    } = req.body;


    // Validate input

    if (!description || !description.trim() || !location || !location.trim()) {

        return res.status(400).json({
            message: "Description and location are required."
        });

    }


    // =====================================================
    // AI CLASSIFICATION
    // =====================================================

    const classification =
        classifyComplaint(description);


    const {
        category,
        priority,
        department
    } = classification;


    // =====================================================
    // FIND DEPARTMENT
    // =====================================================

    const departmentQuery = `
        SELECT department_id
        FROM departments
        WHERE department_name = ?
    `;


    db.query(
        departmentQuery,
        [department],
        (err, departmentResults) => {

            if (err) {

                console.error(
                    "Department lookup error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to find department."
                });

            }


            if (departmentResults.length === 0) {

                return res.status(400).json({
                    message:
                        "Department not found in database."
                });

            }


            const departmentId =
                departmentResults[0].department_id;


            // =====================================================
            // INSERT COMPLAINT
            // =====================================================

            const insertQuery = `
                INSERT INTO complaints
                (
                    user_id,
                    description,
                    category,
                    priority,
                    department_id,
                    location
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;


            db.query(
                insertQuery,
                [
                    userId,
                    description.trim(),
                    category,
                    priority,
                    departmentId,
                    location.trim()
                ],
                (err, result) => {

                    if (err) {

                        console.error(
                            "Complaint insertion error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to save complaint."
                        });

                    }


                    // =====================================================
                    // SUCCESS RESPONSE
                    // =====================================================

                    res.status(201).json({

                        message:
                            "Complaint submitted successfully.",

                        complaint: {

                            complaint_id:
                                result.insertId,

                            description:
                                description.trim(),

                            location:
                                location.trim(),

                            category:
                                category,

                            priority:
                                priority,

                            department:
                                department,

                            status:
                                "Reported"

                        }

                    });

                }
            );

        }
    );

});


// =====================================================
// GET MY COMPLAINTS
// =====================================================

router.get("/", authMiddleware, (req, res) => {

    const userId = req.user.user_id;


    const sql = `
        SELECT
            c.complaint_id,
            c.description,
            c.category,
            c.priority,
            c.location,
            c.status,
            c.created_at,
            c.updated_at,
            d.department_name
        FROM complaints c
        LEFT JOIN departments d
            ON c.department_id = d.department_id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Error fetching complaints:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch complaints."
                });

            }


            res.json({
                complaints: results
            });

        }
    );

});


// =====================================================
// GET COMPLAINT STATISTICS
// =====================================================

router.get(
    "/stats",
    authMiddleware,
    (req, res) => {

        const userId =
            req.user.user_id;


        const sql = `
            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN status = 'Reported'
                        THEN 1
                        ELSE 0
                    END
                ) AS reported,

                SUM(
                    CASE
                        WHEN status = 'In Progress'
                        THEN 1
                        ELSE 0
                    END
                ) AS inProgress,

                SUM(
                    CASE
                        WHEN status = 'Resolved'
                        THEN 1
                        ELSE 0
                    END
                ) AS resolved

            FROM complaints

            WHERE user_id = ?
        `;


        db.query(
            sql,
            [userId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Error fetching complaint statistics:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to fetch complaint statistics."
                    });

                }


                const total =
                    Number(results[0].total) || 0;

                const reported =
                    Number(results[0].reported) || 0;

                const inProgress =
                    Number(results[0].inProgress) || 0;

                const resolved =
                    Number(results[0].resolved) || 0;


                // Active complaints means
                // Reported + In Progress

                const active =
                    reported + inProgress;


                res.json({

                    total:
                        total,

                    reported:
                        reported,

                    active:
                        active,

                    inProgress:
                        inProgress,

                    resolved:
                        resolved

                });

            }
        );

    }
);


// =====================================================
// EXPORT ROUTER
// =====================================================


// ADMIN: Update complaint status
router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = [
            "Reported",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status."
            });
        }

        // Check whether the logged-in user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        const [result] = await db.promise().query(
            `
            UPDATE complaints
            SET status = ?
            WHERE complaint_id = ?
            `,
            [status, complaintId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        res.json({
            message: "Complaint status updated successfully.",
            complaint_id: complaintId,
            status: status
        });

    } catch (error) {
        console.error("Status update error:", error);

        res.status(500).json({
            message: "Failed to update complaint status."
        });
    }
});

// ADMIN: Get all complaints
router.get("/admin/all", authMiddleware, async (req, res) => {
    try {
        // Only admin can access this route
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        const [complaints] = await db.promise().query(
            `
            SELECT
                c.complaint_id,
                c.description,
                c.category,
                c.priority,
                c.location,
                c.status,
                c.created_at,
                c.updated_at,
                u.name AS citizen_name,
                u.email AS citizen_email,
                d.department_name
            FROM complaints c
            JOIN users u
                ON c.user_id = u.user_id
            LEFT JOIN departments d
                ON c.department_id = d.department_id
            ORDER BY c.created_at DESC
            `
        );

        res.json({
            complaints: complaints
        });

    } catch (error) {
        console.error("Admin complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch complaints."
        });
    }
});
// ==========================================
// ADMIN UPDATE COMPLAINT STATUS
// ==========================================

router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = [
            "Reported",
            "In Progress",
            "Resolved"
        ];

        // Check valid status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status."
            });
        }

        // Only admin/department officer can update
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Department officer only."
            });
        }

        const [result] = await db.promise().query(
            `
            UPDATE complaints
            SET status = ?
            WHERE complaint_id = ?
            `,
            [status, complaintId]
        );

        // Complaint doesn't exist
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        res.json({
            message: "Complaint status updated successfully.",
            complaint_id: complaintId,
            status: status
        });

    } catch (error) {
        console.error(
            "Status update error:",
            error
        );

        res.status(500).json({
            message: "Failed to update complaint status."
        });
    }
});

// Submit feedback for a resolved complaint
router.post("/:id/feedback", authMiddleware, async (req, res) => {
    try {
        const complaintId = req.params.id;
        const userId = req.user.user_id;
        const { rating, feedback_text } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });
        }

        // Check whether complaint belongs to the logged-in citizen
        const [complaints] = await db.promise().query(
            `
            SELECT complaint_id, status
            FROM complaints
            WHERE complaint_id = ? AND user_id = ?
            `,
            [complaintId, userId]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        // Feedback is allowed only for resolved complaints
        if (complaints[0].status !== "Resolved") {
            return res.status(400).json({
                message: "Feedback can be submitted only for resolved complaints."
            });
        }

        // Save feedback
        await db.promise().query(
            `
            INSERT INTO feedback
            (complaint_id, user_id, rating, feedback_text)
            VALUES (?, ?, ?, ?)
            `,
            [complaintId, userId, rating, feedback_text || null]
        );

        res.status(201).json({
            message: "Feedback submitted successfully."
        });

    } catch (error) {
        console.error("Feedback error:", error);

        res.status(500).json({
            message: "Failed to submit feedback."
        });
    }
});

module.exports = router;
