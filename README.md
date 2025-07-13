# Survey AI Hub

AI 기반 설문 시스템 프로젝트

## 프로젝트 개요

AI 기반 설문 시스템을 구축하는 프로젝트입니다.

## 프로젝트 구조

```
survey-ai-hub/
├── frontend/          # React + TypeScript 프론트엔드
├── backend/           # Node.js + Express + TypeScript 백엔드
├── shared/            # 공통 타입 및 유틸리티
├── docs/              # 프로젝트 문서
└── README.md          # 프로젝트 메인 문서
```

## 기술 스택

### 프론트엔드

- React 18
- TypeScript
- CSS Modules

### 백엔드

- Node.js
- Express.js
- TypeScript
- MySQL (MariaDB)
- Google Gemini AI API

## 현재 상태 (2024-07-13)

### ✅ 완료된 작업

1. **프로젝트 초기화**

   - 모노레포 구조 생성
   - 프론트엔드: React + TypeScript 초기화
   - 백엔드: Node.js + Express + TypeScript 초기화

2. **공통 모듈 설정**

   - shared/ 폴더에 공통 타입 (types.ts) 생성
   - shared/ 폴더에 공통 유틸리티 (utils.ts) 생성
   - 프론트엔드 tsconfig.json에 @shared 경로 alias 추가

3. **백엔드 구조 설계**

   - 설문 유형별 라우터 분리 (teto-gender, mbti, custom)
   - 설문 메타데이터 관리 시스템
   - AI 평가 로직 분리
   - 컨트롤러 분리 구조

4. **데이터베이스 설계**

   - MySQL 스키마 설계 (survey_types, survey_languages, questions, question_options, i18n, users, survey_responses, survey_statistics)
   - 마이그레이션 스크립트 생성

5. **환경 설정**

   - .env 파일 설정 (데이터베이스, AI API 키, 서버 설정)
   - dotenv 환경변수 로딩 설정

6. **프론트엔드 개발 완료**

   - React + TypeScript 프로젝트 구조 설정
   - 컴포넌트 기반 아키텍처 구현
   - API 연동 서비스 구현
   - 라우팅 시스템 구축
   - 반응형 UI 디자인 적용

7. **데이터베이스 연동 완료**
   - MySQL 연결 유틸리티 구현 (DatabaseService)
   - 메모리 상 임시 데이터를 실제 DB 연동으로 변경
   - 초기 데이터 INSERT 쿼리 생성 (ON DUPLICATE KEY UPDATE 적용)
   - 설문 목록, 메타데이터, 질문 조회를 DB에서 처리하도록 수정
   - 설문 결과 저장 기능 구현
   - 서버 시작 시 DB 연결 테스트 추가

### 🔄 진행 중인 작업

- 백엔드 서버 실행 및 테스트
- 데이터베이스 연동 테스트
- 프론트엔드 실행 및 테스트

### 📋 다음 단계

1. 프론트엔드 실행 및 테스트
2. 백엔드-프론트엔드 통합 테스트
3. 데이터베이스 연동 완성
4. 전체 시스템 최적화

## 설치 및 실행

### 백엔드 실행

```bash
cd backend
npm install
npx ts-node src/server.ts
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

## 환경 변수 설정

백엔드 `.env` 파일에 다음 설정이 필요합니다:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Database (MySQL)
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=survey_ai_hub

# Logging
LOG_LEVEL=info
```

## 데이터베이스 설정

1. MySQL/MariaDB 서버 실행
2. `database/schema.sql` 실행하여 데이터베이스 및 테이블 생성
3. `database/initial-data.sql` 실행하여 초기 데이터 삽입
4. 마이그레이션 스크립트 실행: `node migrate.js`

### 초기 데이터 삽입

```bash
# MySQL에 접속하여 초기 데이터 삽입
mysql -u your_username -p survey_ai_hub < database/initial-data.sql
```

또는 MySQL Workbench에서 `database/initial-data.sql` 파일을 실행하세요.

## 개발 규칙

1. **명명 규칙**: kebab-case 사용
2. **공통 모듈**: shared/ 폴더에 작성
3. **문서화**: 모든 작업 내역을 README.md에 기록
4. **PowerShell**: && 연산자 사용 금지, 명령어는 한 줄씩 실행
5. **코드 스타일**: 한글 주석, 명확한 변수명, 에러 처리, 함수 분리
6. **데이터베이스 쿼리**: INSERT 쿼리 작성 시 ON DUPLICATE KEY UPDATE 구문을 사용하여 이미 존재하는 데이터는 업데이트되도록 구현

## API 엔드포인트

### 설문 관련

- `GET /api/surveys` - 설문 목록 조회
- `GET /api/surveys/:type` - 특정 설문 조회
- `GET /api/surveys/:type/questions` - 설문 질문 조회
- `POST /api/surveys/:type/evaluate` - 설문 제출 및 AI 평가

### 헬스 체크

- `GET /health` - 서버 상태 확인

## API 테스트

### Node.js 테스트 스크립트

```bash
cd backend
node test/test-api-endpoints.js
```

### PowerShell 테스트 스크립트

```powershell
cd backend
.\test\test-api-powershell.ps1
```

### curl 테스트 스크립트 (Linux/Mac)

```bash
cd backend
chmod +x test/test-api-curl.sh
./test/test-api-curl.sh
```

### 수동 테스트 예시

```bash
# 헬스 체크
curl http://localhost:4000/health

# 설문 목록 조회
curl http://localhost:4000/api/surveys

# 특정 설문 조회
curl http://localhost:4000/api/surveys/teto-gender

# 설문 질문 조회
curl http://localhost:4000/api/surveys/teto-gender/questions?lang=ko

# 설문 평가
curl -X POST http://localhost:4000/api/surveys/teto-gender/evaluate \
  -H "Content-Type: application/json" \
  -d '{"answers":{"q1":"남자","q2":"대화하기"},"language":"ko"}'
```

## 로그

서버 로그는 `backend/logs/` 폴더에 저장됩니다.
