module.exports = async (req, res) => {
  try {
    const SHEET_URL = process.env.SHEET_URL;

    if (!SHEET_URL) {
      return res.status(500).json({ error: "SHEET_URL is missing" });
    }

    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch sheet data" });
    }

    const data = await response.json();

    const plots = Array.isArray(data)
      ? data
      : Object.values(data)[0];

    res.status(200).json(plots);
  } catch (err) {
    res.status(500).json({
      error: "Serverless function crashed",
      message: err.message
    });
  }
};
