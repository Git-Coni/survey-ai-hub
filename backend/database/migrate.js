require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

async function runMigration() {
  let connection;

  try {
    // 데이터베이스 연결 설정
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: parseInt(process.env.DB_PORT || "3306"),
    };

    console.log("📋 Database configuration:");
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Port: ${config.port}\n`);

    // 데이터베이스 연결 (데이터베이스명 제외)
    connection = await mysql.createConnection(config);

    console.log("Connected to MySQL server");

    // 스키마 파일 읽기
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = await fs.readFile(schemaPath, "utf8");

    // SQL 문장들을 분리하여 실행
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // 각 문장 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            console.log(`⚠ Statement ${i + 1} skipped (duplicate entry)`);
          } else if (error.code === "ER_DB_CREATE_EXISTS") {
            console.log(
              `⚠ Statement ${i + 1} skipped (database already exists)`
            );
          } else {
            console.error(
              `✗ Error executing statement ${i + 1}:`,
              error.message
            );
            // 치명적이지 않은 오류는 계속 진행
            if (error.code !== "ER_TABLE_EXISTS_ERROR") {
              throw error;
            }
          }
        }
      }
    }

    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("💡 Make sure MySQL server is running and accessible.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("💡 Check your database username and password.");
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// 스크립트가 직접 실행될 때만 마이그레이션 실행
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
