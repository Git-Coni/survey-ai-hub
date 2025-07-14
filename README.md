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

- ✅ 백엔드 서버 실행 및 테스트
- ✅ 데이터베이스 연동 테스트
- ✅ 프론트엔드 실행 및 테스트
- ✅ 환경별 설정 시스템 구축 (local, dev, prd)

### 📋 다음 단계

1. 환경별 설정값 세부 조정
2. 백엔드-프론트엔드 통합 테스트
3. 데이터베이스 연동 완성
4. 전체 시스템 최적화

## 설치 및 실행

### 환경별 설정

프로젝트는 3가지 환경을 지원합니다:

- **local**: 로컬 개발 환경 (기본값)
- **dev**: 개발 서버 환경
- **prd**: 프로덕션 환경

### 백엔드 실행

#### 로컬 환경 (기본)

```bash
cd backend
npm install
npm run dev
```

#### 개발 환경

```bash
cd backend
npm run dev:dev
```

#### 프로덕션 환경

```bash
cd backend
npm run dev:prd
```

### 프론트엔드 실행

#### 로컬 환경 (기본)

```bash
cd frontend
npm install
npm start
npm run dev
```

#### 개발 환경

```bash
cd frontend
npm run dev:dev
```

#### 프로덕션 환경

```bash
cd frontend
npm run dev:prd
```

## 환경 변수 설정

### 환경별 설정 구조

프로젝트는 환경별로 구분된 환경변수를 사용합니다:

- **LOCAL\_\*** : 로컬 환경 설정
- **DEV\_\*** : 개발 환경 설정
- **PRD\_\*** : 프로덕션 환경 설정

### .env 파일 구성 예시

```env
# ========================================
# LOCAL Environment Configuration
# ========================================
LOCAL_DB_HOST=localhost
LOCAL_DB_USER=root
LOCAL_DB_PASSWORD=your_local_password
LOCAL_DB_NAME=survey_ai_hub
LOCAL_DB_PORT=3306
LOCAL_PORT=4000
LOCAL_FRONTEND_URL=http://localhost:3000
LOCAL_LOG_LEVEL=info
LOCAL_AI_MODEL=gemini-pro
LOCAL_GEMINI_API_KEY=your_gemini_api_key_here
LOCAL_AI_MAX_TOKENS=1000

# ========================================
# DEV Environment Configuration
# ========================================
DEV_DB_HOST=192.168.0.3
DEV_DB_USER=coni
DEV_DB_PASSWORD=133007
DEV_DB_NAME=survey_ai_hub_dev
DEV_DB_PORT=3306
DEV_PORT=4000
DEV_FRONTEND_URL=https://dev.survey-ai-hub.com
DEV_LOG_LEVEL=debug
DEV_AI_MODEL=gemini-pro
DEV_GEMINI_API_KEY=your_dev_gemini_api_key_here
DEV_AI_MAX_TOKENS=1500

# ========================================
# PRD Environment Configuration
# ========================================
PRD_DB_HOST=192.168.0.3
PRD_DB_USER=coni
PRD_DB_PASSWORD=133007
PRD_DB_NAME=survey_ai_hub_prd
PRD_DB_PORT=3306
PRD_PORT=4000
PRD_FRONTEND_URL=https://survey-ai-hub.com
PRD_LOG_LEVEL=warn
PRD_AI_MODEL=gemini-pro
PRD_GEMINI_API_KEY=your_prd_gemini_api_key_here
PRD_AI_MAX_TOKENS=2000
```

### ⚠️ 중요 사항

- **모든 환경변수는 필수**입니다 (기본값 없음)
- 환경변수가 누락되면 서버/앱 시작 시 오류가 발생합니다
- 각 환경별로 모든 설정값을 반드시 입력해야 합니다

### 프론트엔드 환경변수 설정

프론트엔드도 환경별 설정을 지원합니다:

```env
# ========================================
# LOCAL Environment Configuration
# ========================================
REACT_APP_LOCAL_API_URL=http://localhost:4000
REACT_APP_LOCAL_API_TIMEOUT=10000

# ========================================
# DEV Environment Configuration
# ========================================
REACT_APP_DEV_API_URL=https://dev-api.survey-ai-hub.com
REACT_APP_DEV_API_TIMEOUT=15000

# ========================================
# PRD Environment Configuration
# ========================================
REACT_APP_PRD_API_URL=https://api.survey-ai-hub.com
REACT_APP_PRD_API_TIMEOUT=20000
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
7. **환경변수 파일**: .env 파일에는 한글 주석 사용 금지 (인코딩 문제 방지)

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

## 🐞 로컬 디버깅(백엔드) 실행 방법

### 1. ts-node로 직접 디버깅 (TypeScript 소스 브레이크포인트)

```powershell
cd backend
npm install
npx cross-env NODE_ENV=local ts-node --inspect src/server.ts
```

- 위 명령어 실행 후, VSCode에서 "실행 및 디버그" → "Chrome에 연결" 또는 "Node.js에 연결" 선택
- 브라우저에서 `chrome://inspect` 접속 후 디버깅 가능

### 2. 빌드 후 디버깅 (JavaScript 빌드 결과물 브레이크포인트)

```powershell
cd backend
npm run build
npx cross-env NODE_ENV=local node --inspect dist/server.js
```

- TypeScript 소스맵(`tsconfig.json`의 `sourceMap: true`)이 설정되어 있으면, TypeScript 원본에서 브레이크포인트 가능

### 3. VSCode launch.json 예시

`.vscode/launch.json`에 아래와 같이 추가하면 VSCode에서 바로 디버깅 가능:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "ts-node 디버그 (백엔드)",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "local"
      },
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "빌드 결과물 디버그 (백엔드)",
      "program": "${workspaceFolder}/backend/dist/server.js",
      "env": {
        "NODE_ENV": "local"
      },
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 4. 주의사항

- PowerShell에서는 환경변수 설정에 cross-env를 반드시 사용해야 함
- tsconfig.json에 `sourceMap: true`가 반드시 설정되어야 TypeScript 원본에서 브레이크포인트 가능
- .env 파일이 backend 폴더에 정확히 존재해야 하며, 모든 LOCAL\_ 변수들이 누락 없이 입력되어야 함
- 디버깅 중 환경변수 누락/오타가 있으면 서버가 시작되지 않음
