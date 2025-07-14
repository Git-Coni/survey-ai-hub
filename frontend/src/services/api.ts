import axios, { AxiosResponse } from "axios";
import {
  SurveyType,
  SurveyMetadata,
  SurveyQuestion,
  SurveyResult,
  SurveysResponse,
  SurveyMetadataResponse,
  SurveyQuestionsResponse,
  SurveyEvaluationResponse,
} from "../types";
import { getConfig } from "../config";

// API 기본 설정 - 환경별 설정 사용
const config = getConfig();
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

// API 서비스 클래스
export class ApiService {
  // 헬스 체크
  static async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    version: string;
  }> {
    const response: AxiosResponse = await apiClient.get("/health");
    return response.data;
  }

  // 설문 목록 조회
  static async getSurveys(): Promise<SurveyMetadata[]> {
    const response: AxiosResponse<SurveysResponse> = await apiClient.get(
      "/surveys"
    );
    return response.data.surveys;
  }

  // 특정 설문 메타데이터 조회
  static async getSurveyMetadata(type: SurveyType): Promise<SurveyMetadata> {
    const response: AxiosResponse<SurveyMetadataResponse> = await apiClient.get(
      `/surveys/${type}`
    );
    return response.data.metadata;
  }

  // 설문 질문 조회
  static async getSurveyQuestions(
    type: SurveyType,
    language: string = "ko"
  ): Promise<{ questions: SurveyQuestion[]; metadata: SurveyMetadata }> {
    const response: AxiosResponse<SurveyQuestionsResponse> =
      await apiClient.get(`/surveys/${type}/questions?lang=${language}`);
    return {
      questions: response.data.questions,
      metadata: response.data.metadata,
    };
  }

  // 설문 평가
  static async evaluateSurvey(
    type: SurveyType,
    answers: Record<string, string>,
    language: string = "ko"
  ): Promise<{ result: SurveyResult; metadata: SurveyMetadata }> {
    const response: AxiosResponse<SurveyEvaluationResponse> =
      await apiClient.post(`/surveys/${type}/evaluate`, {
        answers,
        language,
      });
    return {
      result: response.data.result,
      metadata: response.data.metadata,
    };
  }
}

// 커스텀 훅을 위한 에러 타입
export interface ApiError {
  message: string;
  status?: number;
}

// API 상태 관리를 위한 타입
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export default ApiService;
