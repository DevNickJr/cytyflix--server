import express from "express"
import { registerRoutes } from "./routes";
import preRouteMiddleware from "./shared/middlewares/pre-route.middleware";

const app = express();

preRouteMiddleware(app)
registerRoutes(app);

export { app };