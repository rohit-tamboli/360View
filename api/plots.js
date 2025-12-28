export default async function handler(req, res) {
  try {
    const SHEET_URL = process.env.SHEET_URL;

    if (!SHEET_URL) {
      return res.status(500).json({ error: "SHEET_URL not defined" });
    }

    const response = await fetch(SHEET_URL);
    const data = await response.json();

    const plots = Array.isArray(data)
      ? data
      : Object.values(data)[0];

    res.status(200).json(plots);
  } catch (error) {
    res.status(500).json({
      error: "Serverless function crashed",
      message: error.message
    });
  }
}
