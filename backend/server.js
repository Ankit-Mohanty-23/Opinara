import dotenv from "dotenv";
import os from "os";
import cluster from "node:cluster";
import mongoose from "mongoose";
import app from "./src/app.js";
import logger from "./src/util/logger.js";

const totalCPUs = os.cpus().length;

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

if (cluster.isPrimary) {
  let readyWorker = 0;
  logger.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("message", (worker, message) => {
    if (message?.type === "WORKER_READY") {
      readyWorker++;

      if (readyWorker === totalCPUs) {
        logger.info(`Server is listening to Port: ${PORT} \nAll ${totalCPUs} workers are online and serving traffic`);
      }
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died (code= ${code}, signal= ${signal}). \nRestarting...`
    );
    readyWorker--;
    cluster.fork();
  });
} else {
  (async () => {
    try {
      await mongoose.connect(MONGO_URL);
      process.send?.({ type: "WORKER_READY", pid: process.pid });
      app.listen(PORT);
    } catch (err) {
      logger.error(`Worker ${process.pid}: Failed to connect to DB`, err);
      process.exit(1);
    }
  })();
}
