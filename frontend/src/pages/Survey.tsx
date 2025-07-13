import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { SurveyType, SurveyQuestion, SurveyMetadata } from "../types";
import "./Survey.css";

const Survey: React.FC = () => {
  const { type } = useParams<{ type: SurveyType }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [metadata, setMetadata] = useState<SurveyMetadata | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!type) return;

      try {
        setLoading(true);
        const { questions: surveyQuestions, metadata: surveyMetadata } =
          await ApiService.getSurveyQuestions(type, "ko");
        setQuestions(surveyQuestions);
        setMetadata(surveyMetadata);
      } catch (err) {
        setError("설문 데이터를 불러오는데 실패했습니다.");
        console.error("설문 데이터 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [type]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!type || !metadata) return;

    try {
      setSubmitting(true);
      const { result } = await ApiService.evaluateSurvey(type, answers, "ko");

      // 결과 페이지로 이동 (상태를 URL 파라미터나 세션스토리지로 전달)
      navigate("/result", {
        state: {
          result,
          metadata,
          answers,
          surveyType: type,
        },
      });
    } catch (err) {
      setError("설문 제출에 실패했습니다.");
      console.error("설문 제출 오류:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='container'>
        <div className='loading'>설문을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container'>
        <div className='error'>{error}</div>
      </div>
    );
  }

  if (!questions.length || !metadata) {
    return (
      <div className='container'>
        <div className='error'>설문을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion.id];

  return (
    <div className='container'>
      <div className='survey-container'>
        {/* 진행률 표시 */}
        <div className='survey-progress'>
          <div className='progress-bar'>
            <div
              className='progress-fill'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className='progress-text'>
            {currentStep + 1} / {questions.length}
          </div>
        </div>

        {/* 설문 정보 */}
        <div className='survey-info'>
          <h1>{metadata.name}</h1>
          <p>{metadata.description}</p>
        </div>

        {/* 질문 카드 */}
        <div className='question-card'>
          <div className='question-header'>
            <span className='question-number'>질문 {currentStep + 1}</span>
            <h2>{currentQuestion.question}</h2>
          </div>

          <div className='options-container'>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  answers[currentQuestion.id] === option ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className='survey-navigation'>
          {currentStep > 0 && (
            <button
              className='btn btn-secondary'
              onClick={handlePrevious}
              disabled={submitting}
            >
              이전
            </button>
          )}

          {!isLastQuestion ? (
            <button
              className='btn btn-primary'
              onClick={handleNext}
              disabled={!canProceed || submitting}
            >
              다음
            </button>
          ) : (
            <button
              className='btn btn-primary'
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
            >
              {submitting ? "분석 중..." : "결과 보기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;
