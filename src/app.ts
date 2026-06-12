import express from "express"
import { registerRoutes } from "./routes";
import preRouteMiddleware from "./shared/middlewares/pre-route.middleware";
import ErrorMiddleware from "./shared/middlewares/error.middleware";

const app = express();

preRouteMiddleware(app);

app.get("/ping", (_req, res) => {
  res.json({ status: "ok" });
});

registerRoutes(app);
ErrorMiddleware(app);

export { app };
