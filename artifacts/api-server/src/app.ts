import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import mockRouter from "./routes/mock";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If MOCK_DB is set, serve in-memory mocked endpoints instead of real DB-backed routes
if (process.env.MOCK_DB === "true") {
  app.use("/api", mockRouter);
} else {
  // dynamically import real router to avoid loading DB at module initialization
  (async () => {
    const { default: router } = await import("./routes");
    app.use("/api", router);
  })().catch((err) => {
    // Log import errors but allow process to continue for debugging
    // eslint-disable-next-line no-console
    console.error("Failed to load DB-backed routes:", err);
  });
}

export default app;
