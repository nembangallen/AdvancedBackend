import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
  }),
);

app.use(routes);
import { requireAuth } from "./middleware/auth.middleware";
app.get("/me", requireAuth, (req: any, res) => {
  res.json({ user: req.user });
});

app.get("/health", (req: any, res) => {
  res.status(200).json({ status: "ok" });
});
app.use(errorHandler);
