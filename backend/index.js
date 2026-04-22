import dotenv from "dotenv";
import express from "express";
import { loadData } from "./dataLoader.js";
import { generateInsight } from "./groqService.js";
import { getDeveloperMetrics, getDevelopers, getManagerRows } from "./metricsService.js";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

let dataCache;
try {
  dataCache = loadData();
} catch (error) {
  console.error("Failed to load workbook on startup:", error.message);
  process.exit(1);
}

app.get("/api/developers", (_req, res) => {
  res.json(getDevelopers(dataCache));
});

app.get("/api/metrics/:developerId/:month", (req, res) => {
  const { developerId, month } = req.params;
  const metrics = getDeveloperMetrics(dataCache, developerId, month);

  if (!metrics) {
    return res.status(404).json({ error: "No metrics found for that developer/month." });
  }

  return res.json(metrics);
});

app.get("/api/manager", (_req, res) => {
  res.json(getManagerRows(dataCache));
});

app.get("/api/insight/:developerId/:month", async (req, res) => {
  const { developerId, month } = req.params;
  const metrics = getDeveloperMetrics(dataCache, developerId, month);

  if (!metrics) {
    return res.status(404).json({ error: "No metrics found for that developer/month." });
  }

  try {
    const insight = await generateInsight(metrics);
    return res.json(insight);
  } catch (error) {
    console.error("Groq insight generation failed:", error.message);
    return res.status(500).json({
      error: "Failed to generate AI insight. Check GROQ_API_KEY and try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`DevPulse backend running on http://localhost:${port}`);
});
