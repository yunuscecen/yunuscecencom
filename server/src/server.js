import "dotenv/config";
import mongoose from "mongoose";
import { configureCloudinary } from "./config/cloudinary.js";
import { validateEnvironment } from "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    validateEnvironment();
    configureCloudinary();
    await connectDB();

    server = app.listen(port, () => {
      console.log(`API http://localhost:${port} adresinde çalışıyor.`);
    });
  } catch (error) {
    console.error(`Sunucu başlatılamadı: ${error.message}`);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} alındı. Sunucu kapatılıyor...`);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } else {
    await mongoose.connection.close();
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();