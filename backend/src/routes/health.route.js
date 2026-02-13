import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * Liveness Probe
 * Checks if the Node process is alive.
 * Should NOT depend on DB or external services.
 */
router.get("/", (req, res) => {
  const memory = process.memoryUsage();

  res.status(200).json({
    status: "alive",
    uptime: process.uptime(), 
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Readiness Probe
 * Checks if the app is ready to receive traffic.
 * Validates MongoDB connection.
 */
router.get("/ready", (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;

  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? "ready" : "not_ready",
    database: dbReady ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;
