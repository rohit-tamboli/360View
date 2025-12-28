import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.SHEET_URL);

    const data = Array.isArray(response.data)
      ? response.data
      : Object.values(response.data)[0];

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch plot data" });
  }
}
