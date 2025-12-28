require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API
app.get("/api/plots", async (req, res) => {
  try {
    const response = await fetch(process.env.SHEET_URL);
    const data = await response.json();

    const plots = Array.isArray(data)
      ? data
      : Object.values(data)[0];

    res.json(plots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local server running at http://localhost:${PORT}`);
});
