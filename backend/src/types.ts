// 백엔드에서 사용할 타입 정의

export type SurveyType = "teto-gender" | "mbti";

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

export interface User {
  id: string;
  createdAt: string;
  lastActiveAt: string;
  language: string;
}
