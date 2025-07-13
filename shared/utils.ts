// 공통 유틸리티 함수

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function isValidLanguage(lang: string): boolean {
  return ["ko", "en", "jp", "vn"].includes(lang);
}

export function formatSurveyType(type: string): string {
  const typeMap: Record<string, string> = {
    "teto-gender": "테토 에겐 성향",
    mbti: "MBTI 성격 유형",
  };
  return typeMap[type] || type;
}
