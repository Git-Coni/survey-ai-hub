import { localConfig } from "./environments/local";
import { devConfig } from "./environments/dev";
import { prdConfig } from "./environments/prd";
import { logger } from "../utils/logger";

// 환경 타입 정의
export type Environment = "local" | "dev" | "prd";

// 설정 타입 정의
export interface AppConfig {
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
  server: {
    port: number;
    frontendUrl: string;
  };
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
    logFilePath?: string;
  };
  ai: {
    model: string;
    apiKey: string;
    maxTokens: number;
  };
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// 환경별 설정 매핑
const configs: Record<Environment, () => AppConfig> = {
  local: () => ({
    database: {
      host: process.env.LOCAL_DB_HOST!,
      user: process.env.LOCAL_DB_USER!,
      password: process.env.LOCAL_DB_PASSWORD!,
      database: process.env.LOCAL_DB_NAME!,
      port: parseInt(process.env.LOCAL_DB_PORT!),
    },
    server: {
      port: parseInt(process.env.LOCAL_PORT!),
      frontendUrl: process.env.LOCAL_FRONTEND_URL!,
    },
    logging: {
      level: process.env.LOCAL_LOG_LEVEL!,
      enableConsole: true,
      enableFile: false,
    },
    ai: {
      model: process.env.LOCAL_AI_MODEL!,
      apiKey: process.env.LOCAL_GEMINI_API_KEY!,
      maxTokens: parseInt(process.env.LOCAL_AI_MAX_TOKENS!),
    },
    environment: "local",
    isDevelopment: true,
    isProduction: false,
  }),
  dev: devConfig,
  prd: prdConfig,
};

// 현재 환경 결정
function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV?.toLowerCase();
  logger.info(`Getting environment for NODE_ENV: ${env}`);

  if (env === "production" || env === "prd") {
    return "prd";
  } else if (env === "development" || env === "dev") {
    return "dev";
  } else {
    return "local";
  }
}

// 현재 환경의 설정 반환
export function getConfig(): AppConfig {
  const currentEnv = getCurrentEnvironment();
  logger.info(`Loading config for environment: ${currentEnv}`);

  const configGenerator = configs[currentEnv];
  if (typeof configGenerator === "function") {
    const config = configGenerator();
    logger.info("Generated config:", {
      database: {
        host: config.database.host,
        port: config.database.port,
        database: config.database.database,
      },
    });
    return config;
  }

  throw new Error(`Invalid environment: ${currentEnv}`);
}

// 특정 환경의 설정 반환
export function getConfigByEnvironment(environment: Environment): AppConfig {
  const configGenerator = configs[environment];
  if (typeof configGenerator === "function") {
    return configGenerator();
  }
  throw new Error(`Invalid environment: ${environment}`);
}

// 현재 환경 정보 반환
export function getCurrentEnvironmentInfo(): Environment {
  return getCurrentEnvironment();
}

// 환경변수 검증 함수
function validateEnvironmentVariables(environment: Environment): boolean {
  const envPrefix = environment.toUpperCase();
  const requiredVars = [
    `${envPrefix}_DB_HOST`,
    `${envPrefix}_DB_USER`,
    `${envPrefix}_DB_PASSWORD`,
    `${envPrefix}_DB_NAME`,
    `${envPrefix}_DB_PORT`,
    `${envPrefix}_PORT`,
    `${envPrefix}_FRONTEND_URL`,
    `${envPrefix}_LOG_LEVEL`,
    `${envPrefix}_AI_MODEL`,
    `${envPrefix}_GEMINI_API_KEY`,
    `${envPrefix}_AI_MAX_TOKENS`,
  ];

  const missingVars: string[] = [];

  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    logger.error(
      `❌ 다음 필수 환경변수가 설정되지 않았습니다 (${environment} 환경):`
    );
    missingVars.forEach((varName) => {
      logger.error(`   - ${varName}`);
    });
    logger.error(
      `\n.env 파일을 확인하고 모든 필수 환경변수가 설정되어 있는지 확인해주세요.`
    );
    return false;
  }

  logger.info(
    `✅ 모든 필수 환경변수가 정상적으로 설정되어 있습니다. (${environment} 환경)`
  );
  return true;
}

// 설정 유효성 검사
export function validateConfig(config: AppConfig): boolean {
  const currentEnv = getCurrentEnvironment();
  const envPrefix = currentEnv.toUpperCase();

  // 환경변수 검증
  if (!validateEnvironmentVariables(currentEnv)) {
    return false;
  }

  // config 객체에 값이 제대로 매핑되었는지 확인
  const configMapping = {
    "database.host": process.env[`${envPrefix}_DB_HOST`],
    "database.user": process.env[`${envPrefix}_DB_USER`],
    "database.password": process.env[`${envPrefix}_DB_PASSWORD`],
    "database.database": process.env[`${envPrefix}_DB_NAME`],
    "database.port": process.env[`${envPrefix}_DB_PORT`],
    "server.port": process.env[`${envPrefix}_PORT`],
    "server.frontendUrl": process.env[`${envPrefix}_FRONTEND_URL`],
    "logging.level": process.env[`${envPrefix}_LOG_LEVEL`],
    "ai.model": process.env[`${envPrefix}_AI_MODEL`],
    "ai.apiKey": process.env[`${envPrefix}_GEMINI_API_KEY`],
    "ai.maxTokens": process.env[`${envPrefix}_AI_MAX_TOKENS`],
  };

  for (const [configPath, envValue] of Object.entries(configMapping)) {
    const keys = configPath.split(".");
    let configValue: any = config;
    for (const key of keys) {
      configValue = configValue?.[key];
    }

    if (!configValue) {
      logger.error(`설정값이 없습니다. 설정 경로: ${configPath}`);
      logger.error(`환경변수 값: ${envValue}, 설정값: ${configValue}`);
      return false;
    }

    // 숫자형 값에 대한 특별 처리
    if (typeof configValue === "number") {
      const numEnvValue = Number(envValue);
      if (isNaN(numEnvValue) || configValue !== numEnvValue) {
        logger.error(
          `설정값이 환경변수와 일치하지 않습니다. 설정 경로: ${configPath}`
        );
        logger.error(`환경변수 값: ${envValue}, 설정값: ${configValue}`);
        return false;
      }
    } else if (configValue !== envValue) {
      logger.error(
        `설정값이 환경변수와 일치하지 않습니다. 설정 경로: ${configPath}`
      );
      logger.error(`환경변수 값: ${envValue}, 설정값: ${configValue}`);
      return false;
    }
  }

  return true;
}
