module.exports = async (req, res) => {
  try {
    const response = await fetch(process.env.SHEET_URL);
    const data = await response.json();

    const plots = Array.isArray(data)
      ? data
      : Object.values(data)[0];

    res.status(200).json(plots);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
