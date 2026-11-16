const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());
app.use(express.json());


// =========================================
// AUTHENTICATION ROUTES
// =========================================

app.use("/api/auth", authRoutes);


// =========================================
// COMPLAINT ROUTES
// =========================================

app.use("/api/complaints", complaintRoutes);


// =========================================
// PROTECTED TEST ROUTE
// =========================================

app.get("/api/protected", authMiddleware, (req, res) => {

    res.json({
        message: "You accessed a protected Civixa route!",
        user: req.user
    });

});


// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {

    res.send("Civixa Backend Server is Running!");

});


// =========================================
// SERVER
// =========================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Civixa backend running on http://localhost:${PORT}`
    );

});