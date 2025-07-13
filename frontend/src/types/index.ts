// 설문 관련 타입 정의

export type SurveyType = "teto-gender" | "mbti";

export interface SurveyMetadata {
  type: SurveyType;
  name: string;
  description: string;
  version: string;
  questionCount: number;
  estimatedTime: number;
  supportedLanguages: string[];
  aiModel: string;
}

export interface SurveyQuestion {
  id: string;
  step: number;
  question: string;
  options: string[];
}

export interface SurveyAnswer {
  questionId: string;
  answer: string;
}

export interface SurveyResult {
  type: string;
  explanation: string;
  advice: string;
  nextType?: string;
  loveChainInfo?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// API 응답 타입들
export interface SurveysResponse {
  surveys: SurveyMetadata[];
}

export interface SurveyMetadataResponse {
  metadata: SurveyMetadata;
}

export interface SurveyQuestionsResponse {
  type: SurveyType;
  questions: SurveyQuestion[];
  metadata: SurveyMetadata;
}

export interface SurveyEvaluationResponse {
  type: SurveyType;
  result: SurveyResult;
  metadata: SurveyMetadata;
}
