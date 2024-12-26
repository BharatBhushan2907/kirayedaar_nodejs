const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require("./config/db");
connectDB();

// Initialize app
const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(cors());
app.use(bodyParser.json());


// Import routes
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");


// Use routes
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});


