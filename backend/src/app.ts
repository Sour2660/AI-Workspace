import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import routes from "./routes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Backend Working ✅");
});

// Mount API routes
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.send("Backend Working ✅");
});
// Global Error Handler (must be last)
app.use(errorHandler);

export default app;