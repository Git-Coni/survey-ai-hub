import mysql, { RowDataPacket } from "mysql2/promise";
import { logger } from "./logger";
import { getConfig } from "../config";

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

// MySQL 버전 결과를 위한 인터페이스
interface VersionRow extends RowDataPacket {
  version: string;
}

export class DatabaseService {
  private pool: mysql.Pool;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;

    // 설정값 로깅
    logger.info("데이터베이스 연결 설정:", {
      host: config.host,
      user: config.user,
      database: config.database,
      port: config.port || 3306,
    });

    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    });
  }

  // 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      logger.info("데이터베이스 연결 시도 중...");
      const connection = await this.pool.getConnection();
      await connection.ping();

      const [rows] = await connection.execute<VersionRow[]>(
        "SELECT VERSION() as version"
      );
      logger.info("데이터베이스 연결 성공:", { version: rows[0]?.version });

      connection.release();
      return true;
    } catch (error) {
      logger.error("데이터베이스 연결 실패. 상세 정보:", {
        host: this.config.host,
        user: this.config.user,
        database: this.config.database,
        port: this.config.port,
        error: error,
      });
      return false;
    }
  }

  // 설문 유형 목록 조회
  async getSurveyTypes(): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(`
        SELECT
          st.*,
          GROUP_CONCAT(sl.language_code) as supported_languages
        FROM survey_types st
        LEFT JOIN survey_languages sl ON st.id = sl.survey_type_id
        WHERE st.is_active = TRUE
        GROUP BY st.id
        ORDER BY st.id
      `);
      return rows as any[];
    } catch (error) {
      logger.error("Error getting survey types:", error);
      throw error;
    }
  }

  // 특정 설문 유형 조회
  async getSurveyType(typeCode: string): Promise<any> {
    try {
      const [rows] = await this.pool.execute(
        `
        SELECT
          st.*,
          GROUP_CONCAT(sl.language_code) as supported_languages
        FROM survey_types st
        LEFT JOIN survey_languages sl ON st.id = sl.survey_type_id
        WHERE st.type_code = ? AND st.is_active = TRUE
        GROUP BY st.id
      `,
        [typeCode]
      );

      return (rows as any[])[0] || null;
    } catch (error) {
      logger.error("Error getting survey type:", error);
      throw error;
    }
  }

  // 설문 질문 조회
  async getSurveyQuestions(
    surveyTypeId: number,
    language: string = "ko"
  ): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(
        `
        SELECT
          q.id,
          q.question_key,
          q.step,
          q.question_type,
          q.is_required,
          qi.translated_text as question_text,
          GROUP_CONCAT(
            JSON_OBJECT(
              'key', qo.option_key,
              'order', qo.option_order,
              'value', qo.option_value,
              'text', oi.translated_text
            ) ORDER BY qo.option_order
          ) as options
        FROM questions q
        LEFT JOIN i18n qi ON q.question_key = qi.key_name AND qi.lang_code = ?
        LEFT JOIN question_options qo ON q.id = qo.question_id
        LEFT JOIN i18n oi ON qo.option_key = oi.key_name AND oi.lang_code = ?
        WHERE q.survey_type_id = ? AND q.is_active = TRUE
        GROUP BY q.id
        ORDER BY q.step, q.id
      `,
        [language, language, surveyTypeId]
      );

      return rows as any[];
    } catch (error) {
      logger.error("Error getting survey questions:", error);
      throw error;
    }
  }

  // 설문 응답 저장
  async saveSurveyResponse(responseData: {
    responseId: string;
    surveyTypeId: number;
    userId?: string;
    language: string;
    answers: Record<string, string>;
    result: any;
    aiModelUsed: string;
    processingTimeMs: number;
    startedAt: Date;
    completedAt: Date;
  }): Promise<void> {
    try {
      await this.pool.execute(
        `
        INSERT INTO survey_responses (
          response_id, survey_type_id, user_id, language, answers,
          result_type, result_explanation, result_advice, result_metadata,
          ai_model_used, processing_time_ms, started_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          responseData.responseId,
          responseData.surveyTypeId,
          responseData.userId || null,
          responseData.language,
          JSON.stringify(responseData.answers),
          responseData.result.type,
          responseData.result.explanation,
          responseData.result.advice,
          JSON.stringify(responseData.result),
          responseData.aiModelUsed,
          responseData.processingTimeMs,
          responseData.startedAt,
          responseData.completedAt,
        ]
      );

      logger.info(`Survey response saved: ${responseData.responseId}`);
    } catch (error) {
      logger.error("Error saving survey response:", error);
      throw error;
    }
  }

  // 번역 데이터 조회
  async getTranslations(
    language: string,
    context?: string
  ): Promise<Record<string, string>> {
    try {
      let query =
        "SELECT key_name, translated_text FROM i18n WHERE lang_code = ?";
      const params = [language];

      if (context) {
        query += " AND context = ?";
        params.push(context);
      }

      const [rows] = await this.pool.execute(query, params);

      const translations: Record<string, string> = {};
      (rows as any[]).forEach((row) => {
        translations[row.key_name] = row.translated_text;
      });

      return translations;
    } catch (error) {
      logger.error("Error getting translations:", error);
      throw error;
    }
  }

  // 연결 종료
  async close(): Promise<void> {
    await this.pool.end();
    logger.info("Database connection pool closed");
  }
}

// 싱글톤 인스턴스
let databaseService: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseService) {
    const appConfig = getConfig();

    // 환경 설정 디버깅 로그
    logger.info("데이터베이스 서비스 초기화:", {
      environment: appConfig.environment,
      host: appConfig.database.host,
      port: appConfig.database.port,
      database: appConfig.database.database,
      user: appConfig.database.user,
    });

    const config: DatabaseConfig = {
      host: appConfig.database.host,
      user: appConfig.database.user,
      password: appConfig.database.password,
      database: appConfig.database.database,
      port: appConfig.database.port,
    };

    // 설정값 유효성 검사
    if (!config.host || !config.user || !config.password || !config.database) {
      logger.error("데이터베이스 설정 누락:", {
        hasHost: !!config.host,
        hasUser: !!config.user,
        hasPassword: !!config.password,
        hasDatabase: !!config.database,
        hasPort: !!config.port,
      });
      throw new Error("필수 데이터베이스 설정이 누락되었습니다.");
    }

    databaseService = new DatabaseService(config);
  }

  return databaseService;
}
