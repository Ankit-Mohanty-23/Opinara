import dotenv from "dotenv";
import os from "os";
import cluster from "node:cluster";
import mongoose from "mongoose";
import app from "./src/app.js";

const totalCPUs = os.cpus().length;

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. \nRestarting...`);
    cluster.fork();
  });
} else {

  (async () => {
    try{
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`Worker ${process.pid}: Mongodb connected to ${conn.connection.name}`);

        app.listen(PORT, () => {
            console.log(`Worker ${process.pid}: app is listening to ${PORT} Port`);
        });
    }catch(err){
        console.error(`Worker ${process.pid}: Failed to connect to DB`, err);
        process.exit(1);
    }
  })();
}
