import { localConfig } from "./environments/local";
import { devConfig } from "./environments/dev";
import { prdConfig } from "./environments/prd";

// 환경 타입 정의
export type Environment = "local" | "dev" | "prd";

// 설정 타입 정의
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    environment: string;
  };
  features: {
    enableDebug: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
  };
  ui: {
    theme: string;
    language: string;
    enableAnimations: boolean;
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
  const env = process.env.REACT_APP_ENV?.toLowerCase();

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
  const requiredFields = ["api.baseUrl", "app.name", "app.environment"];

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

// 환경변수 검증 함수
function validateEnvironmentVariables(environment: Environment): boolean {
  const envPrefix = `REACT_APP_${environment.toUpperCase()}`;
  const requiredVars = [`${envPrefix}_API_URL`, `${envPrefix}_API_TIMEOUT`];

  const missingVars: string[] = [];

  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `❌ Missing required environment variables for ${environment} environment:`
    );
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      `\nPlease check your .env file and ensure all required variables are set.`
    );
    return false;
  }

  console.log(
    `✅ All required environment variables for ${environment} environment are set.`
  );
  return true;
}

// 초기화 시 환경변수 검증
export function initializeConfig(): void {
  const currentEnv = getCurrentEnvironment();
  console.log(`🚀 Initializing frontend in ${currentEnv} environment`);

  // 환경변수 검증
  if (!validateEnvironmentVariables(currentEnv)) {
    console.error(
      `❌ Environment variables validation failed. App will not start.`
    );
    throw new Error(
      `Missing required environment variables for ${currentEnv} environment`
    );
  }

  const config = getConfig();
  if (validateConfig(config)) {
    console.log(`✅ Configuration loaded successfully`);
    console.log(`📡 API Base URL: ${config.api.baseUrl}`);
    console.log(`🔧 Debug Mode: ${config.features.enableDebug}`);
  } else {
    console.error(`❌ Configuration validation failed. App will not start.`);
    throw new Error(
      `Configuration validation failed for ${currentEnv} environment`
    );
  }
}
