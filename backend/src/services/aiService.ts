import { GoogleGenerativeAI } from "@google/generative-ai";
import { SurveyType, SurveyResult } from "../types";
import { logger } from "../utils/logger";

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    // 지연 초기화 - 실제 AI 기능 사용 시에만 초기화
  }

  private initializeAI() {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY environment variable is required for AI features"
        );
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
  }

  // 설문 유형별 AI 평가 로직
  async evaluateSurvey(
    surveyType: SurveyType,
    answers: Record<string, string>,
    language: string = "ko"
  ): Promise<SurveyResult> {
    this.initializeAI(); // AI 초기화

    switch (surveyType) {
      case "teto-gender":
        return this.evaluateTetoGender(answers, language);
      case "mbti":
        return this.evaluateMBTI(answers, language);
      default:
        throw new Error(`Unsupported survey type: ${surveyType}`);
    }
  }

  private async evaluateTetoGender(
    answers: Record<string, string>,
    language: string
  ): Promise<SurveyResult> {
    const answersString = Object.entries(answers)
      .map(([q, a]) => `${q}: ${a}`)
      .join("\n");

    const prompt = `
      Based on the following answers, please evaluate the user's personality.
      
      Answers:
      ${answersString}
      
      Choose exactly one personality type: "egen-boy", "egen-girl", "teto-boy", or "teto-girl".
      
      Respond in valid JSON with these keys:
      - "type": the chosen type.
      - "explanation": describe how their answers reflect this type.
      - "advice": give practical guidance for this type.
      - "next_type": the next type in the Love Food Chain.
      - "love_chain_info": explain why this type is attracted to next_type.
      
      Language: ${language}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // JSON 파싱
      if (text.startsWith("```json")) {
        text = text.replace("```json", "").replace("```", "").trim();
      }

      return JSON.parse(text);
    } catch (error) {
      logger.error("AI evaluation error:", error);
      throw new Error("Failed to evaluate survey");
    }
  }

  private async evaluateMBTI(
    answers: Record<string, string>,
    language: string
  ): Promise<SurveyResult> {
    // MBTI 평가 로직 (구현 예정)
    const prompt = `
      Based on the following MBTI answers, determine the user's MBTI type.
      
      Answers:
      ${Object.entries(answers)
        .map(([q, a]) => `${q}: ${a}`)
        .join("\n")}
      
      Respond in valid JSON with these keys:
      - "type": the MBTI type (e.g., "INTJ", "ENFP")
      - "explanation": describe the personality characteristics
      - "advice": give practical advice for this type
      
      Language: ${language}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      if (text.startsWith("```json")) {
        text = text.replace("```json", "").replace("```", "").trim();
      }

      return JSON.parse(text);
    } catch (error) {
      logger.error("MBTI evaluation error:", error);
      throw new Error("Failed to evaluate MBTI");
    }
  }
}
