# API 엔드포인트 테스트 스크립트 (PowerShell 버전)
# 사용법: .\test-api-powershell.ps1

$SERVER_URL = "http://localhost:4000"

Write-Host "🚀 API 엔드포인트 테스트 시작 (PowerShell)" -ForegroundColor Blue
Write-Host "📡 서버: $SERVER_URL" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# 테스트 카운터
$TOTAL_TESTS = 0
$PASSED_TESTS = 0
$FAILED_TESTS = 0

# 테스트 실행 함수
function Run-Test {
    param(
        [string]$TestName,
        [string]$ExpectedStatus,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Data = ""
    )
    
    $script:TOTAL_TESTS++
    
    Write-Host "`n🧪 테스트: $TestName" -ForegroundColor Cyan
    Write-Host "   URL: $Method $Url" -ForegroundColor Gray
    
    try {
        # HTTP 요청 구성
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Method -eq "POST" -and $Data) {
            $response = Invoke-RestMethod -Uri "$SERVER_URL$Url" -Method $Method -Headers $headers -Body $Data -StatusCodeVariable statusCode
        } else {
            $response = Invoke-RestMethod -Uri "$SERVER_URL$Url" -Method $Method -StatusCodeVariable statusCode
        }
        
        Write-Host "   응답 상태: $statusCode" -ForegroundColor Gray
        
        # 상태 코드 검증
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ 성공" -ForegroundColor Green
            $script:PASSED_TESTS++
        } else {
            Write-Host "   ❌ 실패 (예상: $ExpectedStatus, 실제: $statusCode)" -ForegroundColor Red
            $script:FAILED_TESTS++
        }
        
        # 응답 출력 (간단히)
        $responseJson = $response | ConvertTo-Json -Depth 2
        if ($responseJson.Length -gt 100) {
            Write-Host "   응답: $($responseJson.Substring(0, 100))..." -ForegroundColor Gray
        } else {
            Write-Host "   응답: $responseJson" -ForegroundColor Gray
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   응답 상태: $statusCode" -ForegroundColor Gray
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ 성공 (예상된 오류)" -ForegroundColor Green
            $script:PASSED_TESTS++
        } else {
            Write-Host "   ❌ 실패 (예상: $ExpectedStatus, 실제: $statusCode)" -ForegroundColor Red
            $script:FAILED_TESTS++
        }
        
        Write-Host "   오류: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 서버 연결 테스트
Write-Host "`n🔍 서버 연결 테스트" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$SERVER_URL/health" -Method GET
    Write-Host "✅ 서버 연결 성공" -ForegroundColor Green
} catch {
    Write-Host "❌ 서버 연결 실패" -ForegroundColor Red
    Write-Host "백엔드 서버가 실행 중인지 확인해주세요 (포트 4000)" -ForegroundColor Red
    exit 1
}

# 테스트 실행
Run-Test -TestName "헬스 체크" -ExpectedStatus "200" -Url "/health"
Run-Test -TestName "루트 엔드포인트" -ExpectedStatus "200" -Url "/"
Run-Test -TestName "설문 목록 조회" -ExpectedStatus "200" -Url "/api/surveys"
Run-Test -TestName "테토 성향 설문 메타데이터" -ExpectedStatus "200" -Url "/api/surveys/teto-gender"
Run-Test -TestName "존재하지 않는 설문 (404)" -ExpectedStatus "404" -Url "/api/surveys/invalid-survey"
Run-Test -TestName "테토 성향 질문 (한국어)" -ExpectedStatus "200" -Url "/api/surveys/teto-gender/questions?lang=ko"
Run-Test -TestName "테토 성향 질문 (영어)" -ExpectedStatus "200" -Url "/api/surveys/teto-gender/questions?lang=en"
Run-Test -TestName "MBTI 질문" -ExpectedStatus "200" -Url "/api/surveys/mbti/questions?lang=ko"

# POST 테스트
$testAnswers = @{
    answers = @{
        q1 = "남자"
        q2 = "대화하기"
    }
    language = "ko"
} | ConvertTo-Json

Run-Test -TestName "설문 평가 (성공)" -ExpectedStatus "200" -Url "/api/surveys/teto-gender/evaluate" -Method "POST" -Data $testAnswers

$emptyAnswers = @{
    answers = @{}
    language = "ko"
} | ConvertTo-Json

Run-Test -TestName "설문 평가 (빈 답변)" -ExpectedStatus "400" -Url "/api/surveys/teto-gender/evaluate" -Method "POST" -Data $emptyAnswers

$invalidAnswers = @{
    answers = @{
        q1 = "test"
    }
    language = "ko"
} | ConvertTo-Json

Run-Test -TestName "존재하지 않는 설문 평가" -ExpectedStatus "404" -Url "/api/surveys/invalid-survey/evaluate" -Method "POST" -Data $invalidAnswers

# 결과 출력
Write-Host "`n==================================================" -ForegroundColor Blue
Write-Host "📊 테스트 결과 요약" -ForegroundColor Blue
Write-Host "총 테스트: $TOTAL_TESTS" -ForegroundColor White
Write-Host "성공: $PASSED_TESTS ✅" -ForegroundColor Green
Write-Host "실패: $FAILED_TESTS ❌" -ForegroundColor Red

if ($TOTAL_TESTS -gt 0) {
    $successRate = [math]::Round(($PASSED_TESTS / $TOTAL_TESTS) * 100, 1)
    Write-Host "성공률: $successRate%" -ForegroundColor Yellow
}

if ($FAILED_TESTS -eq 0) {
    Write-Host "`n🎉 모든 테스트 통과!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  일부 테스트가 실패했습니다." -ForegroundColor Red
}

Write-Host "`n테스트 완료!" -ForegroundColor Blue 