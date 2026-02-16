import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
import logger from "./src/util/logger.js";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URL);

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}, PID: ${process.pid}`);
    });

  } catch (err) {
    logger.error("Failed to connect to DB", err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});
