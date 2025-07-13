#!/bin/bash

# API 엔드포인트 테스트 스크립트 (curl 버전)
# 사용법: ./test-api-curl.sh

SERVER_URL="http://localhost:4000"

echo "🚀 API 엔드포인트 테스트 시작 (curl)"
echo "📡 서버: $SERVER_URL"
echo "=================================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 테스트 카운터
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 테스트 실행 함수
run_test() {
    local test_name="$1"
    local expected_status="$2"
    local url="$3"
    local method="${4:-GET}"
    local data="${5:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${BLUE}🧪 테스트: $test_name${NC}"
    echo "   URL: $method $url"
    
    # curl 명령어 구성
    local curl_cmd="curl -s -w '\nHTTP_STATUS:%{http_code}'"
    
    if [ "$method" = "POST" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json'"
        if [ -n "$data" ]; then
            curl_cmd="$curl_cmd -d '$data'"
        fi
    fi
    
    curl_cmd="$curl_cmd $SERVER_URL$url"
    
    # 응답 실행
    local response=$(eval $curl_cmd)
    local http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    local body=$(echo "$response" | sed '/HTTP_STATUS:/d')
    
    echo "   응답 상태: $http_status"
    
    # 상태 코드 검증
    if [ "$http_status" = "$expected_status" ]; then
        echo -e "   ${GREEN}✅ 성공${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "   ${RED}❌ 실패 (예상: $expected_status, 실제: $http_status)${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # 응답 본문 출력 (간단히)
    if [ -n "$body" ]; then
        echo "   응답: $(echo "$body" | head -c 100)..."
    fi
}

# 서버 연결 테스트
echo -e "\n${YELLOW}🔍 서버 연결 테스트${NC}"
if curl -s "$SERVER_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ 서버 연결 성공${NC}"
else
    echo -e "${RED}❌ 서버 연결 실패${NC}"
    echo "백엔드 서버가 실행 중인지 확인해주세요 (포트 4000)"
    exit 1
fi

# 테스트 실행
run_test "헬스 체크" "200" "/health"
run_test "루트 엔드포인트" "200" "/"
run_test "설문 목록 조회" "200" "/api/surveys"
run_test "테토 성향 설문 메타데이터" "200" "/api/surveys/teto-gender"
run_test "존재하지 않는 설문 (404)" "404" "/api/surveys/invalid-survey"
run_test "테토 성향 질문 (한국어)" "200" "/api/surveys/teto-gender/questions?lang=ko"
run_test "테토 성향 질문 (영어)" "200" "/api/surveys/teto-gender/questions?lang=en"
run_test "MBTI 질문" "200" "/api/surveys/mbti/questions?lang=ko"

# POST 테스트
run_test "설문 평가 (성공)" "200" "/api/surveys/teto-gender/evaluate" "POST" '{"answers":{"q1":"남자","q2":"대화하기"},"language":"ko"}'
run_test "설문 평가 (빈 답변)" "400" "/api/surveys/teto-gender/evaluate" "POST" '{"answers":{},"language":"ko"}'
run_test "존재하지 않는 설문 평가" "404" "/api/surveys/invalid-survey/evaluate" "POST" '{"answers":{"q1":"test"},"language":"ko"}'

# 결과 출력
echo -e "\n=================================================="
echo -e "${BLUE}📊 테스트 결과 요약${NC}"
echo "총 테스트: $TOTAL_TESTS"
echo -e "성공: ${GREEN}$PASSED_TESTS ✅${NC}"
echo -e "실패: ${RED}$FAILED_TESTS ❌${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$(echo "scale=1; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)
    echo -e "성공률: ${YELLOW}${success_rate}%${NC}"
fi

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 모든 테스트 통과!${NC}"
else
    echo -e "\n${RED}⚠️  일부 테스트가 실패했습니다.${NC}"
fi

echo -e "\n${BLUE}테스트 완료!${NC}" 