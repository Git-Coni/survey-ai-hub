-- Survey AI Hub Database Schema
-- MySQL 8.0+ compatible

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS survey_ai_hub
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 설문 유형 테이블
CREATE TABLE survey_ai_hub.survey_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_code VARCHAR(50) UNIQUE NOT NULL COMMENT '설문 유형 코드 (teto-gender, mbti, custom)',
    name VARCHAR(100) NOT NULL COMMENT '설문 이름',
    description TEXT COMMENT '설문 설명',
    version VARCHAR(20) DEFAULT '1.0.0' COMMENT '버전',
    question_count INT DEFAULT 0 COMMENT '질문 수',
    estimated_time INT DEFAULT 5 COMMENT '예상 소요 시간 (분)',
    ai_model VARCHAR(50) DEFAULT 'gemini-2.0-flash' COMMENT '사용할 AI 모델',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 설문 유형별 지원 언어 테이블
CREATE TABLE survey_ai_hub.survey_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_type_id INT NOT NULL,
    language_code VARCHAR(10) NOT NULL COMMENT '언어 코드 (ko, en, jp, vn)',
    language_name VARCHAR(50) NOT NULL COMMENT '언어 이름',
    is_default BOOLEAN DEFAULT FALSE COMMENT '기본 언어 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_type_id) REFERENCES survey_ai_hub.survey_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_survey_language (survey_type_id, language_code)
);

-- 질문 테이블
CREATE TABLE survey_ai_hub.questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_type_id INT NOT NULL,
    question_key VARCHAR(100) NOT NULL COMMENT '질문 키 (i18n용)',
    step INT NOT NULL COMMENT '질문 순서',
    question_type ENUM('single_choice', 'multiple_choice', 'text', 'scale') DEFAULT 'single_choice' COMMENT '질문 유형',
    is_required BOOLEAN DEFAULT TRUE COMMENT '필수 답변 여부',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_type_id) REFERENCES survey_ai_hub.survey_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_question_key (survey_type_id, question_key)
);

-- 질문 옵션 테이블
CREATE TABLE survey_ai_hub.question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_key VARCHAR(100) NOT NULL COMMENT '옵션 키 (i18n용)',
    option_order INT NOT NULL COMMENT '옵션 순서',
    option_value VARCHAR(255) NOT NULL COMMENT '옵션 값',
    is_correct BOOLEAN DEFAULT FALSE COMMENT '정답 여부 (필요시)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES survey_ai_hub.questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_option_key (question_id, option_key)
);

-- 다국어 번역 테이블
CREATE TABLE survey_ai_hub.i18n (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(200) NOT NULL COMMENT '번역 키',
    lang_code VARCHAR(10) NOT NULL COMMENT '언어 코드',
    translated_text TEXT NOT NULL COMMENT '번역된 텍스트',
    context VARCHAR(100) COMMENT '컨텍스트 (question, option, ui 등)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_key_lang (key_name, lang_code),
    INDEX idx_lang_code (lang_code),
    INDEX idx_context (context)
);

-- 사용자 테이블 (선택적)
CREATE TABLE survey_ai_hub.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE COMMENT '사용자 ID (UUID 등)',
    language VARCHAR(10) DEFAULT 'ko' COMMENT '기본 언어',
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul' COMMENT '시간대',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- 설문 응답 테이블
CREATE TABLE survey_ai_hub.survey_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id VARCHAR(100) UNIQUE NOT NULL COMMENT '응답 ID (UUID)',
    survey_type_id INT NOT NULL,
    user_id VARCHAR(100) COMMENT '사용자 ID (선택적)',
    language VARCHAR(10) DEFAULT 'ko' COMMENT '응답 언어',
    answers JSON NOT NULL COMMENT '답변 데이터 (JSON)',
    result_type VARCHAR(100) COMMENT '결과 유형 (egen-boy, INTJ 등)',
    result_explanation TEXT COMMENT '결과 설명',
    result_advice TEXT COMMENT '결과 조언',
    result_metadata JSON COMMENT '추가 결과 메타데이터',
    ai_model_used VARCHAR(50) COMMENT '사용된 AI 모델',
    processing_time_ms INT COMMENT 'AI 처리 시간 (밀리초)',
    started_at TIMESTAMP COMMENT '설문 시작 시간',
    completed_at TIMESTAMP COMMENT '설문 완료 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_type_id) REFERENCES survey_ai_hub.survey_types(id),
    INDEX idx_response_id (response_id),
    INDEX idx_user_id (user_id),
    INDEX idx_survey_type (survey_type_id),
    INDEX idx_created_at (created_at)
);

-- 설문 통계 테이블 (선택적)
CREATE TABLE survey_ai_hub.survey_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_type_id INT NOT NULL,
    result_type VARCHAR(100) NOT NULL COMMENT '결과 유형',
    count INT DEFAULT 0 COMMENT '해당 결과 수',
    percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT '비율 (%)',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_type_id) REFERENCES survey_ai_hub.survey_types(id),
    UNIQUE KEY unique_survey_result (survey_type_id, result_type)
);

-- 초기 데이터 삽입

-- 설문 유형 데이터
INSERT INTO survey_ai_hub.survey_types (type_code, name, description, question_count, estimated_time) VALUES
('teto-gender', '테토 에겐 성향 테스트', '테토와 에겐의 성향을 분석하여 당신의 성격 유형을 알아보세요', 10, 5),
('mbti', 'MBTI 성격 유형 테스트', 'MBTI 16가지 성격 유형 중 당신의 유형을 찾아보세요', 20, 10),
('custom', '커스텀 설문', '사용자 정의 설문을 통해 개인화된 분석을 받아보세요', 0, 5);

-- 지원 언어 데이터
INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) VALUES
(1, 'ko', '한국어', TRUE),
(1, 'en', 'English', FALSE),
(1, 'jp', '日本語', FALSE),
(1, 'vn', 'Tiếng Việt', FALSE),
(2, 'ko', '한국어', TRUE),
(2, 'en', 'English', FALSE),
(3, 'ko', '한국어', TRUE),
(3, 'en', 'English', FALSE);

-- 기본 번역 데이터 (예시)
INSERT INTO survey_ai_hub.i18n (key_name, lang_code, translated_text, context) VALUES
-- 테토 에겐 질문
('teto_gender_q1', 'ko', '당신의 성별은?', 'question'),
('teto_gender_q1', 'en', 'What is your gender?', 'question'),
('teto_gender_q1_option1', 'ko', '남자', 'option'),
('teto_gender_q1_option1', 'en', 'Male', 'option'),
('teto_gender_q1_option2', 'ko', '여자', 'option'),
('teto_gender_q1_option2', 'en', 'Female', 'option'),

-- MBTI 질문
('mbti_q1', 'ko', '새로운 사람을 만날 때?', 'question'),
('mbti_q1', 'en', 'When meeting new people?', 'question'),
('mbti_q1_option1', 'ko', '적극적으로 대화', 'option'),
('mbti_q1_option1', 'en', 'Actively talk', 'option'),
('mbti_q1_option2', 'ko', '조용히 관찰', 'option'),
('mbti_q1_option2', 'en', 'Quietly observe', 'option');

-- 인덱스 추가
CREATE INDEX idx_survey_responses_survey_type_created ON survey_ai_hub.survey_responses(survey_type_id, created_at);
CREATE INDEX idx_i18n_key_context ON survey_ai_hub.i18n(key_name, context); 