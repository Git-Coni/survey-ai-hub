-- Survey AI Hub 초기 데이터 삽입
-- 이미 존재하는 데이터는 업데이트됩니다 (ON DUPLICATE KEY UPDATE)

-- 설문 유형 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.survey_types (type_code, name, description, question_count, estimated_time, ai_model, is_active) VALUES
('teto-gender', '테토 에겐 성향 테스트', '테토와 에겐의 성향을 분석하여 당신의 성격 유형을 알아보세요', 10, 5, 'gemini-2.0-flash', TRUE),
('mbti', 'MBTI 성격 유형 테스트', 'MBTI 16가지 성격 유형 중 당신의 유형을 찾아보세요', 20, 10, 'gemini-2.0-flash', TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    question_count = VALUES(question_count),
    estimated_time = VALUES(estimated_time),
    ai_model = VALUES(ai_model),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;

-- 설문 유형별 지원 언어 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'ko', '한국어', TRUE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'en', 'English', FALSE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'jp', '日本語', FALSE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'vn', 'Tiếng Việt', FALSE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'ko', '한국어', TRUE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'mbti'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

INSERT INTO survey_ai_hub.survey_languages (survey_type_id, language_code, language_name, is_default) 
SELECT st.id, 'en', 'English', FALSE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'mbti'
ON DUPLICATE KEY UPDATE
    language_name = VALUES(language_name),
    is_default = VALUES(is_default);

-- 테토 에겐 질문 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.questions (survey_type_id, question_key, step, question_type, is_required, is_active)
SELECT st.id, 'teto_gender_q1', 1, 'single_choice', TRUE, TRUE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    step = VALUES(step),
    question_type = VALUES(question_type),
    is_required = VALUES(is_required),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO survey_ai_hub.questions (survey_type_id, question_key, step, question_type, is_required, is_active)
SELECT st.id, 'teto_gender_q2', 2, 'single_choice', TRUE, TRUE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'teto-gender'
ON DUPLICATE KEY UPDATE
    step = VALUES(step),
    question_type = VALUES(question_type),
    is_required = VALUES(is_required),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;

-- MBTI 질문 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.questions (survey_type_id, question_key, step, question_type, is_required, is_active)
SELECT st.id, 'mbti_q1', 1, 'single_choice', TRUE, TRUE FROM survey_ai_hub.survey_types st WHERE st.type_code = 'mbti'
ON DUPLICATE KEY UPDATE
    step = VALUES(step),
    question_type = VALUES(question_type),
    is_required = VALUES(is_required),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;

-- 테토 에겐 질문 옵션 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'teto_gender_q1_option1', 1, 'male' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'teto-gender' AND q.question_key = 'teto_gender_q1'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'teto_gender_q1_option2', 2, 'female' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'teto-gender' AND q.question_key = 'teto_gender_q1'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'teto_gender_q2_option1', 1, 'talk' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'teto-gender' AND q.question_key = 'teto_gender_q2'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'teto_gender_q2_option2', 2, 'activity' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'teto-gender' AND q.question_key = 'teto_gender_q2'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

-- MBTI 질문 옵션 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'mbti_q1_option1', 1, 'extrovert' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'mbti' AND q.question_key = 'mbti_q1'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

INSERT INTO survey_ai_hub.question_options (question_id, option_key, option_order, option_value)
SELECT q.id, 'mbti_q1_option2', 2, 'introvert' FROM survey_ai_hub.questions q 
JOIN survey_ai_hub.survey_types st ON q.survey_type_id = st.id 
WHERE st.type_code = 'mbti' AND q.question_key = 'mbti_q1'
ON DUPLICATE KEY UPDATE
    option_order = VALUES(option_order),
    option_value = VALUES(option_value);

-- 다국어 번역 데이터 삽입/업데이트
INSERT INTO survey_ai_hub.i18n (key_name, lang_code, translated_text, context) VALUES
-- 테토 에겐 질문 번역
('teto_gender_q1', 'ko', '당신의 성별은?', 'question'),
('teto_gender_q1', 'en', 'What is your gender?', 'question'),
('teto_gender_q1', 'jp', 'あなたの性別は？', 'question'),
('teto_gender_q1', 'vn', 'Giới tính của bạn là gì?', 'question'),

('teto_gender_q2', 'ko', '친구들과 만날 때 주로 하는 활동은?', 'question'),
('teto_gender_q2', 'en', 'What do you usually do when meeting friends?', 'question'),
('teto_gender_q2', 'jp', '友達と会う時、主に何をしますか？', 'question'),
('teto_gender_q2', 'vn', 'Bạn thường làm gì khi gặp bạn bè?', 'question'),

-- 테토 에겐 옵션 번역
('teto_gender_q1_option1', 'ko', '남자', 'option'),
('teto_gender_q1_option1', 'en', 'Male', 'option'),
('teto_gender_q1_option1', 'jp', '男性', 'option'),
('teto_gender_q1_option1', 'vn', 'Nam', 'option'),

('teto_gender_q1_option2', 'ko', '여자', 'option'),
('teto_gender_q1_option2', 'en', 'Female', 'option'),
('teto_gender_q1_option2', 'jp', '女性', 'option'),
('teto_gender_q1_option2', 'vn', 'Nữ', 'option'),

('teto_gender_q2_option1', 'ko', '대화하기', 'option'),
('teto_gender_q2_option1', 'en', 'Talk', 'option'),
('teto_gender_q2_option1', 'jp', '話す', 'option'),
('teto_gender_q2_option1', 'vn', 'Trò chuyện', 'option'),

('teto_gender_q2_option2', 'ko', '활동하기', 'option'),
('teto_gender_q2_option2', 'en', 'Activities', 'option'),
('teto_gender_q2_option2', 'jp', '活動する', 'option'),
('teto_gender_q2_option2', 'vn', 'Hoạt động', 'option'),

-- MBTI 질문 번역
('mbti_q1', 'ko', '새로운 사람을 만날 때?', 'question'),
('mbti_q1', 'en', 'When meeting new people?', 'question'),

-- MBTI 옵션 번역
('mbti_q1_option1', 'ko', '적극적으로 대화', 'option'),
('mbti_q1_option1', 'en', 'Actively talk', 'option'),

('mbti_q1_option2', 'ko', '조용히 관찰', 'option'),
('mbti_q1_option2', 'en', 'Quietly observe', 'option')

ON DUPLICATE KEY UPDATE
    translated_text = VALUES(translated_text),
    context = VALUES(context),
    updated_at = CURRENT_TIMESTAMP; 