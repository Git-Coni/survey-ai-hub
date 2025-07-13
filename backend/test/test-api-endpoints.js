/**
 * API 엔드포인트 테스트 스크립트
 *
 * 사용법:
 * 1. 백엔드 서버가 실행 중인지 확인 (포트 4000)
 * 2. node test-api-endpoints.js 실행
 */

const http = require("http");

// 서버 설정
const SERVER_HOST = "localhost";
const SERVER_PORT = 4000;

// 테스트 결과 저장
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

/**
 * HTTP 요청을 보내는 함수
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * 테스트 실행 함수
 */
async function runTest(testName, testFunction) {
  testResults.total++;

  try {
    console.log(`\n🧪 테스트 실행: ${testName}`);
    await testFunction();
    console.log(`✅ 성공: ${testName}`);
    testResults.passed++;
    testResults.details.push({ name: testName, status: "PASSED" });
  } catch (error) {
    console.log(`❌ 실패: ${testName}`);
    console.log(`   오류: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      name: testName,
      status: "FAILED",
      error: error.message,
    });
  }
}

/**
 * 테스트 케이스들
 */

// 1. 헬스 체크 테스트
async function testHealthCheck() {
  const response = await makeRequest("GET", "/health");

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.status || response.data.status !== "healthy") {
    throw new Error("헬스 체크 응답이 올바르지 않습니다");
  }

  console.log(`   응답: ${JSON.stringify(response.data, null, 2)}`);
}

// 2. 루트 엔드포인트 테스트
async function testRootEndpoint() {
  const response = await makeRequest("GET", "/");

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.message || !response.data.endpoints) {
    throw new Error("루트 엔드포인트 응답이 올바르지 않습니다");
  }

  console.log(`   응답: ${JSON.stringify(response.data, null, 2)}`);
}

// 3. 설문 목록 조회 테스트
async function testGetSurveys() {
  const response = await makeRequest("GET", "/api/surveys");

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.surveys || !Array.isArray(response.data.surveys)) {
    throw new Error("설문 목록이 배열 형태가 아닙니다");
  }

  if (response.data.surveys.length === 0) {
    throw new Error("설문 목록이 비어있습니다");
  }

  console.log(`   설문 개수: ${response.data.surveys.length}`);
  console.log(
    `   설문 목록: ${response.data.surveys.map((s) => s.type).join(", ")}`
  );
}

// 4. 특정 설문 메타데이터 조회 테스트 (성공 케이스)
async function testGetSurveyMetadataSuccess() {
  const response = await makeRequest("GET", "/api/surveys/teto-gender");

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (
    !response.data.metadata ||
    response.data.metadata.type !== "teto-gender"
  ) {
    throw new Error("테토 성향 설문 메타데이터가 올바르지 않습니다");
  }

  console.log(`   설문 이름: ${response.data.metadata.name}`);
  console.log(`   질문 개수: ${response.data.metadata.questionCount}`);
}

// 5. 특정 설문 메타데이터 조회 테스트 (실패 케이스)
async function testGetSurveyMetadataFailure() {
  const response = await makeRequest("GET", "/api/surveys/invalid-survey");

  if (response.statusCode !== 404) {
    throw new Error(`예상 상태 코드: 404, 실제: ${response.statusCode}`);
  }

  if (!response.data.error) {
    throw new Error("에러 메시지가 없습니다");
  }

  console.log(`   에러 메시지: ${response.data.error}`);
}

// 6. 설문 질문 조회 테스트 (한국어)
async function testGetSurveyQuestionsKorean() {
  const response = await makeRequest(
    "GET",
    "/api/surveys/teto-gender/questions?lang=ko"
  );

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.questions || !Array.isArray(response.data.questions)) {
    throw new Error("질문 목록이 배열 형태가 아닙니다");
  }

  if (response.data.questions.length === 0) {
    throw new Error("질문 목록이 비어있습니다");
  }

  console.log(`   질문 개수: ${response.data.questions.length}`);
  console.log(`   첫 번째 질문: ${response.data.questions[0].question}`);
}

// 7. 설문 질문 조회 테스트 (영어)
async function testGetSurveyQuestionsEnglish() {
  const response = await makeRequest(
    "GET",
    "/api/surveys/teto-gender/questions?lang=en"
  );

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.questions || !Array.isArray(response.data.questions)) {
    throw new Error("질문 목록이 배열 형태가 아닙니다");
  }

  console.log(`   영어 질문 개수: ${response.data.questions.length}`);
  console.log(`   첫 번째 영어 질문: ${response.data.questions[0].question}`);
}

// 8. MBTI 설문 질문 조회 테스트
async function testGetMBTIQuestions() {
  const response = await makeRequest(
    "GET",
    "/api/surveys/mbti/questions?lang=ko"
  );

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.questions || !Array.isArray(response.data.questions)) {
    throw new Error("MBTI 질문 목록이 배열 형태가 아닙니다");
  }

  console.log(`   MBTI 질문 개수: ${response.data.questions.length}`);
  console.log(`   첫 번째 MBTI 질문: ${response.data.questions[0].question}`);
}

// 9. 설문 평가 테스트 (성공 케이스)
async function testEvaluateSurveySuccess() {
  const testAnswers = {
    q1: "남자",
    q2: "대화하기",
  };

  const response = await makeRequest(
    "POST",
    "/api/surveys/teto-gender/evaluate",
    {
      answers: testAnswers,
      language: "ko",
    }
  );

  if (response.statusCode !== 200) {
    throw new Error(`예상 상태 코드: 200, 실제: ${response.statusCode}`);
  }

  if (!response.data.result || !response.data.result.type) {
    throw new Error("AI 평가 결과가 올바르지 않습니다");
  }

  console.log(`   평가 결과 타입: ${response.data.result.type}`);
  console.log(
    `   설명: ${response.data.result.explanation.substring(0, 50)}...`
  );
}

// 10. 설문 평가 테스트 (빈 답변)
async function testEvaluateSurveyEmptyAnswers() {
  const response = await makeRequest(
    "POST",
    "/api/surveys/teto-gender/evaluate",
    {
      answers: {},
      language: "ko",
    }
  );

  if (response.statusCode !== 400) {
    throw new Error(`예상 상태 코드: 400, 실제: ${response.statusCode}`);
  }

  if (!response.data.error) {
    throw new Error("에러 메시지가 없습니다");
  }

  console.log(`   에러 메시지: ${response.data.error}`);
}

// 11. 존재하지 않는 설문 평가 테스트
async function testEvaluateSurveyNotFound() {
  const testAnswers = { q1: "test" };

  const response = await makeRequest(
    "POST",
    "/api/surveys/invalid-survey/evaluate",
    {
      answers: testAnswers,
      language: "ko",
    }
  );

  if (response.statusCode !== 404) {
    throw new Error(`예상 상태 코드: 404, 실제: ${response.statusCode}`);
  }

  console.log(`   에러 메시지: ${response.data.error}`);
}

/**
 * 메인 테스트 실행 함수
 */
async function runAllTests() {
  console.log("🚀 API 엔드포인트 테스트 시작");
  console.log(`📡 서버: http://${SERVER_HOST}:${SERVER_PORT}`);
  console.log("=" * 50);

  // 서버 연결 테스트
  try {
    await makeRequest("GET", "/health");
    console.log("✅ 서버 연결 성공");
  } catch (error) {
    console.log("❌ 서버 연결 실패");
    console.log("   백엔드 서버가 실행 중인지 확인해주세요 (포트 4000)");
    process.exit(1);
  }

  // 테스트 실행
  await runTest("헬스 체크", testHealthCheck);
  await runTest("루트 엔드포인트", testRootEndpoint);
  await runTest("설문 목록 조회", testGetSurveys);
  await runTest("설문 메타데이터 조회 (성공)", testGetSurveyMetadataSuccess);
  await runTest("설문 메타데이터 조회 (실패)", testGetSurveyMetadataFailure);
  await runTest("설문 질문 조회 (한국어)", testGetSurveyQuestionsKorean);
  await runTest("설문 질문 조회 (영어)", testGetSurveyQuestionsEnglish);
  await runTest("MBTI 설문 질문 조회", testGetMBTIQuestions);
  await runTest("설문 평가 (성공)", testEvaluateSurveySuccess);
  await runTest("설문 평가 (빈 답변)", testEvaluateSurveyEmptyAnswers);
  await runTest("설문 평가 (존재하지 않는 설문)", testEvaluateSurveyNotFound);

  // 결과 출력
  console.log("\n" + "=" * 50);
  console.log("📊 테스트 결과 요약");
  console.log(`총 테스트: ${testResults.total}`);
  console.log(`성공: ${testResults.passed} ✅`);
  console.log(`실패: ${testResults.failed} ❌`);
  console.log(
    `성공률: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`
  );

  if (testResults.failed > 0) {
    console.log("\n❌ 실패한 테스트:");
    testResults.details
      .filter((test) => test.status === "FAILED")
      .forEach((test) => {
        console.log(`   - ${test.name}: ${test.error}`);
      });
  }

  console.log("\n🎉 테스트 완료!");
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("테스트 실행 중 오류 발생:", error);
    process.exit(1);
  });
}

module.exports = {
  makeRequest,
  runTest,
  runAllTests,
};
