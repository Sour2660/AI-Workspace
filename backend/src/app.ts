import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../swagger-output.json";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Home Route
app.get("/", (_req, res) => {
  res.send("Backend Working ✅");
});

// API Routes
app.use("/api", routes);

// Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Global Error Handler (Always Last)
app.use(errorHandler);

export default app;