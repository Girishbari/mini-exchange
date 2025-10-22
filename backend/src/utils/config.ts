import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  apiVersion: process.env.API_VERSION || "v1",
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  logLevel: process.env.LOG_LEVEL || "info",
} as const;

export const isProduction = config.env === "production";
export const isDevelopment = config.env === "development";
