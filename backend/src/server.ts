import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getDatabaseService } from "./utils/database";
import { logger } from "./utils/logger";
import surveyRoutes from "./routes/surveys";
import { getConfig, validateConfig } from "./config";

dotenv.config();

const app = express();
const config = getConfig();
const PORT = config.server.port;

// Middleware
app.use(
  cors({
    origin: config.server.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/surveys", surveyRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Survey AI Hub API Server",
    status: "running",
    endpoints: ["/health", "/api/surveys"],
  });
});

// 서버 시작 및 DB 연결 테스트
async function startServer() {
  try {
    // 설정 유효성 검사
    if (!validateConfig(config)) {
      logger.error("Invalid configuration. Server will not start.");
      process.exit(1);
    }

    logger.info(`Starting server in ${config.environment} environment`);
    logger.info(`Server port: ${config.server.port}`);
    logger.info(`Frontend URL: ${config.server.frontendUrl}`);

    // DB 연결 테스트
    const dbService = getDatabaseService();
    const isConnected = await dbService.testConnection();

    if (!isConnected) {
      logger.error(
        "Failed to connect to database. Server will start but some features may not work."
      );
    } else {
      logger.info("Database connection successful");
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
