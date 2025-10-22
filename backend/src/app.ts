import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import health from "./routes/health.routes";
import orderRoutes from "./routes/order.routes";
import balanceRoutes from "./routes/balance.routes";
import quoteRoutes from "./routes/quote.routes";
import depthRoutes from "./routes/depth.routes";
import path from "path";

export const createApp = (): Application => {
  const app = express();

  app.use(morgan("tiny"));
  // app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(express.static(path.join(__dirname, "../../mini-exchange/dist")));

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.use(`/api/health`, health);
  app.use(`/api/order`, orderRoutes);
  app.use(`/api/balance`, balanceRoutes);
  app.use(`/api/quote`, quoteRoutes);
  app.use(`/api/depth`, depthRoutes);

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../mini-exchange/dist/index.html"));
  });

  return app;
};
