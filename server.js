require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/plots', async (req, res) => {
  try {
    console.log("SHEET_URL:", process.env.SHEET_URL);

    const response = await axios.get(process.env.SHEET_URL);

    // Always return ARRAY
    const data = Array.isArray(response.data)
      ? response.data
      : Object.values(response.data)[0];

    res.json(data);
  } catch (err) {
    console.error("BACKEND ERROR:", err.message);
    res.status(500).json({ error: "Unable to fetch plot data" });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
