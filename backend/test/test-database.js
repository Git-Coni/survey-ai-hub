require("dotenv").config();
const { getDatabaseService } = require("./dist/utils/database");

async function testDatabase() {
  console.log("🔍 Starting database connection test...\n");

  try {
    const db = getDatabaseService();

    // 1. 연결 테스트
    console.log("1️⃣ Testing database connection...");
    const isConnected = await db.testConnection();
    if (isConnected) {
      console.log("✅ Database connection successful!\n");
    } else {
      console.log("❌ Database connection failed!\n");
      return;
    }

    // 2. 설문 유형 조회 테스트
    console.log("2️⃣ Testing survey types query...");
    const surveyTypes = await db.getSurveyTypes();
    console.log(`✅ Found ${surveyTypes.length} survey types:`);
    surveyTypes.forEach((type) => {
      console.log(`   - ${type.type_code}: ${type.name}`);
    });
    console.log("");

    // 3. 특정 설문 유형 조회 테스트
    console.log("3️⃣ Testing specific survey type query...");
    const tetoGender = await db.getSurveyType("teto-gender");
    if (tetoGender) {
      console.log(`✅ Found teto-gender survey: ${tetoGender.name}`);
      console.log(`   Description: ${tetoGender.description}`);
      console.log(`   Questions: ${tetoGender.question_count}`);
      console.log(`   Languages: ${tetoGender.supported_languages}\n`);
    } else {
      console.log("❌ teto-gender survey not found\n");
    }

    // 4. 번역 데이터 조회 테스트
    console.log("4️⃣ Testing translations query...");
    const translations = await db.getTranslations("ko", "question");
    console.log(
      `✅ Found ${
        Object.keys(translations).length
      } Korean question translations:`
    );
    Object.entries(translations)
      .slice(0, 3)
      .forEach(([key, text]) => {
        console.log(`   - ${key}: ${text}`);
      });
    console.log("");

    // 5. 설문 질문 조회 테스트 (teto-gender)
    console.log("5️⃣ Testing survey questions query...");
    if (tetoGender) {
      const questions = await db.getSurveyQuestions(tetoGender.id, "ko");
      console.log(`✅ Found ${questions.length} questions for teto-gender:`);
      questions.forEach((q) => {
        console.log(`   - Step ${q.step}: ${q.question_text}`);
      });
    }
    console.log("");

    console.log("🎉 All database tests completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// 스크립트 실행
testDatabase();
