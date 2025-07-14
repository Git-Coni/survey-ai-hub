import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { getDatabaseService } from "./utils/database";
import { logger } from "./utils/logger";
import surveyRoutes from "./routes/surveys";
import { getConfig, validateConfig } from "./config";

// 환경변수 로드 (가장 먼저 실행되어야 함)
const envPath = path.resolve(__dirname, "../.env");
logger.info(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// 환경변수 로드 확인
logger.info("환경변수 확인:", {
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_DB_HOST: process.env.LOCAL_DB_HOST,
  LOCAL_DB_USER: process.env.LOCAL_DB_USER,
  LOCAL_DB_NAME: process.env.LOCAL_DB_NAME,
  LOCAL_DB_PORT: process.env.LOCAL_DB_PORT,
});

// 설정 로드
const config = getConfig();
logger.info("앱 설정 로드 완료:", {
  environment: config.environment,
  database: {
    host: config.database.host,
    port: config.database.port,
    name: config.database.database,
  },
  server: {
    port: config.server.port,
    frontendUrl: config.server.frontendUrl,
  },
});

const PORT = config.server.port;
const app = express();

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
