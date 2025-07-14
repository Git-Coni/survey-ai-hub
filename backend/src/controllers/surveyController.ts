import { Request, Response } from "express";
import { SurveyType } from "../types";
import { getDatabaseService } from "../utils/database";
import { AIService } from "../services/aiService";
import { logger } from "../utils/logger";

export class SurveyController {
  private aiService: AIService | null = null;
  private dbService: ReturnType<typeof getDatabaseService> | null = null;

  // 지연 초기화를 위한 private 메서드
  private initializeServices() {
    if (!this.aiService) {
      this.aiService = new AIService();
    }
    if (!this.dbService) {
      this.dbService = getDatabaseService();
    }
  }

  // 설문 목록 조회 (DB에서 조회)
  async getSurveys(req: Request, res: Response) {
    try {
      this.initializeServices();
      const surveys = await this.dbService!.getSurveyTypes();

      // 응답 형식 변환
      const formattedSurveys = surveys.map((survey: any) => ({
        type: survey.type_code,
        name: survey.name,
        description: survey.description,
        questionCount: survey.question_count,
        estimatedTime: survey.estimated_time,
        supportedLanguages: survey.supported_languages
          ? survey.supported_languages.split(",")
          : ["ko"],
        aiModel: survey.ai_model,
      }));

      res.json({ surveys: formattedSurveys });
    } catch (error) {
      logger.error("Error getting surveys:", error);
      res.status(500).json({ error: "Failed to get surveys" });
    }
  }

  // 특정 설문 메타데이터 조회 (DB에서 조회)
  async getSurveyMetadata(req: Request, res: Response) {
    try {
      this.initializeServices();
      const { type } = req.params as { type: SurveyType };

      const surveyType = await this.dbService!.getSurveyType(type);

      if (!surveyType) {
        return res.status(404).json({ error: "Survey type not found" });
      }

      const metadata = {
        type: surveyType.type_code,
        name: surveyType.name,
        description: surveyType.description,
        version: surveyType.version,
        questionCount: surveyType.question_count,
        estimatedTime: surveyType.estimated_time,
        supportedLanguages: surveyType.supported_languages
          ? surveyType.supported_languages.split(",")
          : ["ko"],
        aiModel: surveyType.ai_model,
      };

      res.json({ metadata });
    } catch (error) {
      logger.error("Error getting survey metadata:", error);
      res.status(500).json({ error: "Failed to get survey metadata" });
    }
  }

  // 설문 질문 조회 (DB에서 조회)
  async getSurveyQuestions(req: Request, res: Response) {
    try {
      this.initializeServices();
      const { type } = req.params as { type: SurveyType };
      const { lang = "ko" } = req.query as { lang?: string };

      const surveyType = await this.dbService!.getSurveyType(type);

      if (!surveyType) {
        return res.status(404).json({ error: "Survey type not found" });
      }

      const questions = await this.dbService!.getSurveyQuestions(
        surveyType.id,
        lang
      );

      // 응답 형식 변환
      const formattedQuestions = questions.map((question: any) => ({
        id: question.id,
        step: question.step,
        question: question.question_text,
        questionType: question.question_type,
        isRequired: question.is_required,
        options: question.options ? JSON.parse(question.options) : [],
      }));

      const metadata = {
        type: surveyType.type_code,
        name: surveyType.name,
        description: surveyType.description,
        version: surveyType.version,
        questionCount: surveyType.question_count,
        estimatedTime: surveyType.estimated_time,
        supportedLanguages: surveyType.supported_languages
          ? surveyType.supported_languages.split(",")
          : ["ko"],
        aiModel: surveyType.ai_model,
      };

      res.json({
        type,
        questions: formattedQuestions,
        metadata,
      });
    } catch (error) {
      logger.error("Error getting survey questions:", error);
      res.status(500).json({ error: "Failed to get survey questions" });
    }
  }

  // 설문 결과 분석
  async evaluateSurvey(req: Request, res: Response) {
    try {
      this.initializeServices();
      const { type } = req.params as { type: SurveyType };
      const { answers, language = "ko" } = req.body;

      const surveyType = await this.dbService!.getSurveyType(type);

      if (!surveyType) {
        return res.status(404).json({ error: "Survey type not found" });
      }

      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "Answers are required" });
      }

      const startTime = Date.now();
      const result = await this.aiService!.evaluateSurvey(
        type,
        answers,
        language
      );
      const processingTimeMs = Date.now() - startTime;

      // 결과를 DB에 저장
      const responseId = `response_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      await this.dbService!.saveSurveyResponse({
        responseId,
        surveyTypeId: surveyType.id,
        language,
        answers,
        result,
        aiModelUsed: surveyType.ai_model,
        processingTimeMs,
        startedAt: new Date(startTime),
        completedAt: new Date(),
      });

      const metadata = {
        type: surveyType.type_code,
        name: surveyType.name,
        description: surveyType.description,
        version: surveyType.version,
        questionCount: surveyType.question_count,
        estimatedTime: surveyType.estimated_time,
        supportedLanguages: surveyType.supported_languages
          ? surveyType.supported_languages.split(",")
          : ["ko"],
        aiModel: surveyType.ai_model,
      };

      res.json({
        type,
        result,
        metadata,
        responseId,
        processingTimeMs,
      });
    } catch (error) {
      logger.error("Error evaluating survey:", error);
      res.status(500).json({ error: "Failed to evaluate survey" });
    }
  }
}
