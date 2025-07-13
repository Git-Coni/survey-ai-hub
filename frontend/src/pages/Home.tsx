import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "../services/api";
import { SurveyMetadata } from "../types";
import "./Home.css";

const Home: React.FC = () => {
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
      <div className='home-hero'>
        <h1>AI 기반 설문 시스템</h1>
        <p>인공지능이 분석하는 개인화된 설문 결과를 경험해보세요</p>
      </div>

      <div className='surveys-grid'>
        {surveys.map((survey) => (
          <div key={survey.type} className='survey-card'>
            <div className='survey-header'>
              <h3>{survey.name}</h3>
              <span className='survey-type'>{survey.type}</span>
            </div>

            <p className='survey-description'>{survey.description}</p>

            <div className='survey-info'>
              <div className='info-item'>
                <span className='label'>질문 수:</span>
                <span className='value'>{survey.questionCount}개</span>
              </div>
              <div className='info-item'>
                <span className='label'>예상 시간:</span>
                <span className='value'>{survey.estimatedTime}분</span>
              </div>
              <div className='info-item'>
                <span className='label'>지원 언어:</span>
                <span className='value'>
                  {survey.supportedLanguages.join(", ")}
                </span>
              </div>
            </div>

            <Link to={`/survey/${survey.type}`} className='btn btn-primary'>
              설문 시작하기
            </Link>
          </div>
        ))}
      </div>

      <div className='features-section'>
        <h2>주요 기능</h2>
        <div className='features-grid'>
          <div className='feature-card'>
            <h3>🤖 AI 분석</h3>
            <p>Google Gemini AI를 활용한 정확하고 개인화된 분석</p>
          </div>
          <div className='feature-card'>
            <h3>🌍 다국어 지원</h3>
            <p>한국어, 영어, 일본어, 베트남어 등 다양한 언어 지원</p>
          </div>
          <div className='feature-card'>
            <h3>📊 실시간 결과</h3>
            <p>설문 완료 즉시 AI가 분석한 결과를 확인</p>
          </div>
          <div className='feature-card'>
            <h3>📱 반응형 디자인</h3>
            <p>모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 경험</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
