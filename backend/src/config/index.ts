import { localConfig } from "./environments/local";
import { devConfig } from "./environments/dev";
import { prdConfig } from "./environments/prd";

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
const configs: Record<Environment, AppConfig> = {
  local: localConfig,
  dev: devConfig,
  prd: prdConfig,
};

// 현재 환경 결정
function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV?.toLowerCase();

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
  return configs[currentEnv];
}

// 특정 환경의 설정 반환
export function getConfigByEnvironment(environment: Environment): AppConfig {
  return configs[environment];
}

// 현재 환경 정보 반환
export function getCurrentEnvironmentInfo(): Environment {
  return getCurrentEnvironment();
}

// 설정 유효성 검사
export function validateConfig(config: AppConfig): boolean {
  const requiredFields = [
    "database.host",
    "database.user",
    "database.database",
    "server.port",
    "server.frontendUrl",
  ];

  for (const field of requiredFields) {
    const keys = field.split(".");
    let value: any = config;
    for (const key of keys) {
      value = value?.[key];
    }
    if (!value) {
      console.error(`Missing required config field: ${field}`);
      return false;
    }
  }

  return true;
}
