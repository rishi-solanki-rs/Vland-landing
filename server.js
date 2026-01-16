require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

// =========================
// VALIDATE URI
// =========================
function isValidMongoUri(uri) {
  return (
    typeof uri === "string" &&
    (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

// =========================
// MODELS
// =========================
const StatSchema = new mongoose.Schema(
  {
    stats: {
      activeInvestors: { type: Number, default: 0 },
      plotsAvailable: { type: Number, default: 0 },
      avgReturnPercent: { type: Number, default: 0 },
    },
    plotDetails: {
      location: { type: String, default: "Sector C" },
      totalArea: { type: String, default: "1 Acre" },
      estReturn: { type: String, default: "15%" },
    },
    watchlistCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const WatchlistUserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  mobile: String,
  timestamp: { type: Date, default: Date.now },
});

const Stat = mongoose.model("Stat", StatSchema);
const WatchlistUser = mongoose.model("WatchlistUser", WatchlistUserSchema);

// =========================
// HELPERS
// =========================
async function getOrCreateStatsDoc() {
  let doc = await Stat.findOne();
  if (!doc) {
    doc = new Stat();
    await doc.save();
  }
  return doc;
}

// =========================
// ROUTES
// =========================

// Get stats
app.get("/api/landing/stats", async (req, res) => {
  try {
    const doc = await getOrCreateStatsDoc();
    // Prefer authoritative watchlist count from WatchlistUser collection
    let watchlistCount = doc.watchlistCount || 0;
    try {
      const actualCount = await WatchlistUser.countDocuments();
      if (typeof actualCount === 'number' && actualCount >= 0) {
        watchlistCount = actualCount;
      }
    } catch (e) {
      // If counting fails, fall back to stored watchlistCount in stats document
      console.warn('Failed to count WatchlistUser documents, using stored watchlistCount', e);
    }

    res.json({
      stats: doc.stats,
      plotDetails: doc.plotDetails,
      watchlistCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// Update stats
app.post("/api/landing/stats", async (req, res) => {
  try {
    const payload = req.body || {};
    const doc = await getOrCreateStatsDoc();

    if (payload.stats) doc.stats = { ...doc.stats, ...payload.stats };
    if (payload.plotDetails)
      doc.plotDetails = { ...doc.plotDetails, ...payload.plotDetails };
    if (payload.watchlistCount !== undefined)
      doc.watchlistCount = payload.watchlistCount;

    await doc.save();

    res.json({ ok: true, stats: doc.stats, plotDetails: doc.plotDetails, watchlistCount: doc.watchlistCount });
  } catch {
    res.status(500).json({ error: "Failed to save stats" });
  }
});

// Watchlist signup
app.post("/api/watchlist/signup", async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body;

    if (!fullName || !email)
      return res.status(400).json({ error: "fullName and email required" });

    const user = await WatchlistUser.create({ fullName, email, mobile });

    const doc = await getOrCreateStatsDoc();
    doc.watchlistCount = (doc.watchlistCount || 0) + 1;

    if (!doc.stats) doc.stats = {};
    doc.stats.activeInvestors = (doc.stats.activeInvestors || 0) + 1;
    await doc.save();

    res.json({ ok: true, user, watchlistCount: doc.watchlistCount, stats: doc.stats });
  } catch {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname)));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =========================
// START SERVER
// =========================
async function start() {
  try {
    if (!MONGO_URI || !isValidMongoUri(MONGO_URI)) {
      console.error("Mongo URI missing/invalid");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");

    app.listen(PORT, () =>
      console.log(`Server running http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
