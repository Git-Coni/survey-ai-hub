import { Router } from "express";
import { SurveyController } from "../controllers/surveyController";

const router = Router();
const surveyController = new SurveyController();

// 설문 목록 조회
router.get("/", surveyController.getSurveys.bind(surveyController));

// 특정 설문 메타데이터 조회
router.get("/:type", surveyController.getSurveyMetadata.bind(surveyController));

// 특정 설문 유형의 질문 조회
router.get(
  "/:type/questions",
  surveyController.getSurveyQuestions.bind(surveyController)
);

// 설문 결과 분석 (AI 호출)
router.post(
  "/:type/evaluate",
  surveyController.evaluateSurvey.bind(surveyController)
);

export default router;
