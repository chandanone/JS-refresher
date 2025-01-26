require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 4000;
// Create an Express application
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

//serve public files
app.use(express.static(path.join(__dirname, "../public")));

// Serve index.html on the root route

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configure PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getWelcomeData = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM chat_messages WHERE id = 1");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Define API endpoints

app.get("/chat/welcome", getWelcomeData);

// Catch-all for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
