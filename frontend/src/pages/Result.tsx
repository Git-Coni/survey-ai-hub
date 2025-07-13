import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SurveyResult, SurveyMetadata } from "../types";
import "./Result.css";

interface ResultState {
  result: SurveyResult;
  metadata: SurveyMetadata;
  answers: Record<string, string>;
  surveyType: string;
}

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState;

  // 결과 데이터가 없으면 홈으로 리다이렉트
  React.useEffect(() => {
    if (!state || !state.result) {
      navigate("/");
    }
  }, [navigate, state]);

  if (!state || !state.result) {
    return null;
  }

  const { result, metadata, answers, surveyType } = state;

  const handleRetakeSurvey = () => {
    navigate(`/survey/${surveyType}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className='container'>
      <div className='result-container'>
        {/* 결과 헤더 */}
        <div className='result-header'>
          <h1>설문 결과</h1>
          <p>{metadata.name}</p>
        </div>

        {/* 결과 카드 */}
        <div className='result-card'>
          <div className='result-type'>
            <h2>당신의 유형</h2>
            <div className='type-badge'>{result.type}</div>
          </div>

          <div className='result-content'>
            <div className='result-section'>
              <h3>📝 분석 결과</h3>
              <p>{result.explanation}</p>
            </div>

            <div className='result-section'>
              <h3>💡 조언</h3>
              <p>{result.advice}</p>
            </div>

            {result.nextType && (
              <div className='result-section'>
                <h3>❤️ 러브 체인 정보</h3>
                <p>
                  다음 유형: <strong>{result.nextType}</strong>
                </p>
                {result.loveChainInfo && <p>{result.loveChainInfo}</p>}
              </div>
            )}
          </div>
        </div>

        {/* 답변 요약 */}
        <div className='answers-summary'>
          <h3>📋 답변 요약</h3>
          <div className='answers-list'>
            {Object.entries(answers).map(([questionId, answer], index) => (
              <div key={questionId} className='answer-item'>
                <span className='answer-number'>질문 {index + 1}</span>
                <span className='answer-text'>{answer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className='result-actions'>
          <button className='btn btn-secondary' onClick={handleRetakeSurvey}>
            다시 설문하기
          </button>
          <button className='btn btn-primary' onClick={handleGoHome}>
            홈으로 돌아가기
          </button>
        </div>

        {/* 공유 섹션 */}
        <div className='share-section'>
          <h3>결과 공유하기</h3>
          <p>친구들과 함께 설문해보세요!</p>
          <div className='share-buttons'>
            <button className='btn btn-primary'>카카오톡 공유</button>
            <button className='btn btn-secondary'>링크 복사</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
