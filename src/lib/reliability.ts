// AI 답변의 신뢰도를 평가하는 유틸리티 함수

interface ProviderResult {
  provider_name: string;
  model: string;
  status: string;
  output_text: string;
  latency_ms: number;
  tokens?: number;
  error?: string;
}

interface ReliabilityScore {
  overall: number; // 전체 신뢰도 점수 (0-100)
  consistency: number; // 일관성 점수 (0-100)
  completeness: number; // 완성도 점수 (0-100)
  responseTime: number; // 응답 시간 점수 (0-100)
  details: {
    agreementRate: number; // 응답 간 일치율
    averageLength: number; // 평균 응답 길이
    successRate: number; // 성공 응답 비율
    responseTimeScore: number; // 응답 시간 점수
    contentQuality: number; // 내용 품질 점수
  };
}

// 텍스트에서 키워드를 추출하는 함수
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    '이', '그', '저', '의', '를', '을', '에', '와', '과', '로', '으로', '에서', '부터', '까지',
    '은', '는', '이', '가', '도', '만', '부터', '까지', '처럼', '같이', '보다', '마다'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

// 두 텍스트 간의 유사도를 계산하는 함수 (Jaccard 유사도)
function calculateSimilarity(text1: string, text2: string): number {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// 응답 간 일치율을 계산하는 함수
function calculateAgreementRate(responses: string[]): number {
  if (responses.length < 2) return 100;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      totalSimilarity += calculateSimilarity(responses[i], responses[j]);
      comparisons++;
    }
  }
  
  return comparisons > 0 ? (totalSimilarity / comparisons) * 100 : 0;
}

// 응답의 완성도를 평가하는 함수
function evaluateCompleteness(responses: string[]): number {
  if (responses.length === 0) return 0;
  
  const avgLength = responses.reduce((sum, text) => sum + text.length, 0) / responses.length;
  const minLength = Math.min(...responses.map(text => text.length));
  
  // 길이 기반 점수 (100자 이상이면 높은 점수)
  const lengthScore = Math.min(100, (avgLength / 100) * 100);
  
  // 최소 길이 점수 (너무 짧은 응답이 있으면 감점)
  const minLengthScore = Math.min(100, (minLength / 50) * 100);
  
  return (lengthScore + minLengthScore) / 2;
}

// 응답 시간 점수를 계산하는 함수
function calculateResponseTimeScore(responses: ProviderResult[]): number {
  if (responses.length === 0) return 0;
  
  const avgLatency = responses.reduce((sum, r) => sum + r.latency_ms, 0) / responses.length;
  
  // 5초 이하면 높은 점수, 10초 이상이면 낮은 점수
  if (avgLatency <= 5000) return 100;
  if (avgLatency <= 10000) return 80;
  if (avgLatency <= 15000) return 60;
  if (avgLatency <= 20000) return 40;
  return 20;
}

// 내용 품질을 평가하는 함수
function evaluateContentQuality(responses: string[]): number {
  if (responses.length === 0) return 0;
  
  let qualityScore = 0;
  
  responses.forEach(text => {
    // 구조적 요소 점수
    const hasStructure = /[.!?]\s+/.test(text) || text.includes('\n'); // 문장 구분이나 줄바꿈
    const hasNumbers = /\d+/.test(text); // 숫자 포함
    const hasDetails = text.length > 200; // 충분한 길이
    
    let textScore = 0;
    if (hasStructure) textScore += 30;
    if (hasNumbers) textScore += 20;
    if (hasDetails) textScore += 50;
    
    qualityScore += Math.min(100, textScore);
  });
  
  return qualityScore / responses.length;
}

// AI 응답들의 신뢰도를 종합적으로 평가하는 메인 함수
export function calculateReliability(providerResults: ProviderResult[]): ReliabilityScore {
  // 성공한 응답들만 필터링
  const successfulResults = providerResults.filter(result => 
    result.status === 'success' && result.output_text.trim().length > 0
  );
  
  if (successfulResults.length === 0) {
    return {
      overall: 0,
      consistency: 0,
      completeness: 0,
      responseTime: 0,
      details: {
        agreementRate: 0,
        averageLength: 0,
        successRate: 0,
        responseTimeScore: 0,
        contentQuality: 0
      }
    };
  }
  
  const responses = successfulResults.map(result => result.output_text);
  
  // 각 지표 계산
  const agreementRate = calculateAgreementRate(responses);
  const completeness = evaluateCompleteness(responses);
  const responseTimeScore = calculateResponseTimeScore(successfulResults);
  const contentQuality = evaluateContentQuality(responses);
  const successRate = (successfulResults.length / providerResults.length) * 100;
  
  // 일관성 점수 (일치율 + 성공률)
  const consistency = (agreementRate + successRate) / 2;
  
  // 전체 신뢰도 점수 (가중 평균)
  const overall = (
    consistency * 0.3 +      // 일관성 30%
    completeness * 0.25 +    // 완성도 25%
    responseTimeScore * 0.2 + // 응답 시간 20%
    contentQuality * 0.25    // 내용 품질 25%
  );
  
  return {
    overall: Math.round(overall),
    consistency: Math.round(consistency),
    completeness: Math.round(completeness),
    responseTime: Math.round(responseTimeScore),
    details: {
      agreementRate: Math.round(agreementRate),
      averageLength: Math.round(responses.reduce((sum, text) => sum + text.length, 0) / responses.length),
      successRate: Math.round(successRate),
      responseTimeScore: Math.round(responseTimeScore),
      contentQuality: Math.round(contentQuality)
    }
  };
}

// 신뢰도 점수를 등급으로 변환하는 함수
export function getReliabilityGrade(score: number): { grade: string; color: string; description: string } {
  if (score >= 90) {
    return { grade: 'A+', color: 'text-green-600', description: '매우 높은 신뢰도' };
  } else if (score >= 80) {
    return { grade: 'A', color: 'text-green-500', description: '높은 신뢰도' };
  } else if (score >= 70) {
    return { grade: 'B+', color: 'text-blue-500', description: '양호한 신뢰도' };
  } else if (score >= 60) {
    return { grade: 'B', color: 'text-blue-400', description: '보통 신뢰도' };
  } else if (score >= 50) {
    return { grade: 'C+', color: 'text-yellow-500', description: '낮은 신뢰도' };
  } else if (score >= 40) {
    return { grade: 'C', color: 'text-orange-500', description: '매우 낮은 신뢰도' };
  } else {
    return { grade: 'D', color: 'text-red-500', description: '신뢰할 수 없음' };
  }
}
