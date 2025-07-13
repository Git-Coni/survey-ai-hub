require("dotenv").config();
const mysql = require("mysql2/promise");

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...\n");

  let connection;

  try {
    // 데이터베이스 연결 설정
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "survey_ai_hub",
      port: parseInt(process.env.DB_PORT || "3306"),
    };

    console.log("📋 Database configuration:");
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}\n`);

    // 연결 테스트
    console.log("1️⃣ Testing connection...");
    connection = await mysql.createConnection(config);
    await connection.ping();
    console.log("✅ Database connection successful!\n");

    // 데이터베이스 존재 여부 확인
    console.log("2️⃣ Checking database exists...");
    const [databases] = await connection.execute("SHOW DATABASES LIKE ?", [
      config.database,
    ]);
    if (databases.length > 0) {
      console.log(`✅ Database '${config.database}' exists!\n`);
    } else {
      console.log(`❌ Database '${config.database}' does not exist!\n`);
      console.log(
        '💡 Run "npm run migrate" to create the database and tables.\n'
      );
      return;
    }

    // 테이블 존재 여부 확인
    console.log("3️⃣ Checking tables...");
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach((table) => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    console.log("");

    // 설문 유형 데이터 확인
    console.log("4️⃣ Checking survey types...");
    const [surveyTypes] = await connection.execute(
      "SELECT * FROM survey_types WHERE is_active = TRUE"
    );
    console.log(`✅ Found ${surveyTypes.length} active survey types:`);
    surveyTypes.forEach((type) => {
      console.log(`   - ${type.type_code}: ${type.name}`);
    });
    console.log("");

    // 번역 데이터 확인
    console.log("5️⃣ Checking translations...");
    const [translations] = await connection.execute(
      "SELECT COUNT(*) as count FROM i18n WHERE lang_code = ?",
      ["ko"]
    );
    console.log(`✅ Found ${translations[0].count} Korean translations\n`);

    console.log("🎉 Database test completed successfully!");
    console.log("📝 The database is ready for use.\n");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("💡 Check your database username and password.");
    } else if (error.code === "ECONNREFUSED") {
      console.log("💡 Make sure MySQL server is running.");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.log('💡 Run "npm run migrate" to create the database.');
    }

    console.log("\n📋 Troubleshooting:");
    console.log("1. Make sure MySQL server is running");
    console.log("2. Check your .env file has correct database credentials");
    console.log('3. Run "npm run migrate" to create database and tables');
    console.log("4. Make sure you have permission to access the database");
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed");
    }
  }
}

// 스크립트 실행
testDatabaseConnection();
