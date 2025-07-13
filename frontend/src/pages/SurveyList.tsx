import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "../services/api";
import { SurveyMetadata } from "../types";
import "./SurveyList.css";

const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<SurveyMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const surveyData = await ApiService.getSurveys();
        setSurveys(surveyData);
      } catch (err) {
        setError("설문 목록을 불러오는데 실패했습니다.");
        console.error("설문 목록 조회 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <div className='container'>
        <div className='loading'>설문 목록을 불러오는 중...</div>
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

  return (
    <div className='container'>
      <div className='survey-list-header'>
        <h1>설문 목록</h1>
        <p>다양한 AI 기반 설문을 경험해보세요</p>
      </div>

      <div className='survey-list-grid'>
        {surveys.map((survey) => (
          <div key={survey.type} className='survey-list-card'>
            <div className='survey-list-header'>
              <h3>{survey.name}</h3>
              <span className='survey-type-badge'>{survey.type}</span>
            </div>

            <p className='survey-description'>{survey.description}</p>

            <div className='survey-stats'>
              <div className='stat'>
                <span className='stat-label'>질문 수</span>
                <span className='stat-value'>{survey.questionCount}</span>
              </div>
              <div className='stat'>
                <span className='stat-label'>예상 시간</span>
                <span className='stat-value'>{survey.estimatedTime}분</span>
              </div>
              <div className='stat'>
                <span className='stat-label'>지원 언어</span>
                <span className='stat-value'>
                  {survey.supportedLanguages.length}개
                </span>
              </div>
            </div>

            <div className='survey-actions'>
              <Link to={`/survey/${survey.type}`} className='btn btn-primary'>
                설문 시작
              </Link>
              <div className='language-info'>
                지원 언어: {survey.supportedLanguages.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyList;
