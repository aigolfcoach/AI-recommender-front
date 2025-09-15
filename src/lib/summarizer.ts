// AI 응답들을 분석하여 공통 내용을 추출하는 유틸리티 함수

interface ProviderResult {
  provider_name: string;
  model: string;
  status: string;
  output_text: string;
  error?: string;
}

// 텍스트에서 키워드를 추출하는 함수
function extractKeywords(text: string): string[] {
  // 불용어 제거
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    '이', '그', '저', '의', '를', '을', '에', '와', '과', '로', '으로', '에서', '부터', '까지',
    '은', '는', '이', '가', '도', '만', '부터', '까지', '처럼', '같이', '보다', '마다'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 20); // 상위 20개 키워드만
}

// 두 텍스트 간의 유사도를 계산하는 함수 (간단한 Jaccard 유사도)
function calculateSimilarity(text1: string, text2: string): number {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  return intersection.size / union.size;
}

// 공통 키워드를 찾는 함수
function findCommonKeywords(texts: string[]): string[] {
  if (texts.length === 0) return [];
  
  const allKeywords = texts.map(text => extractKeywords(text));
  const keywordCounts = new Map<string, number>();
  
  // 모든 키워드의 빈도 계산
  allKeywords.forEach(keywords => {
    keywords.forEach(keyword => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });
  
  // 2개 이상의 응답에서 나타나는 키워드만 반환
  const threshold = Math.max(2, Math.ceil(texts.length * 0.5));
  return Array.from(keywordCounts.entries())
    .filter(([, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword]) => keyword);
}

// 공통 문장을 찾는 함수
function findCommonSentences(texts: string[]): string[] {
  if (texts.length < 2) return [];
  
  const sentences = texts.map(text => 
    text.split(/[.!?]\s+/).filter(s => s.trim().length > 10)
  );
  
  const commonSentences: string[] = [];
  
  // 첫 번째 텍스트의 문장들을 기준으로 다른 텍스트들과 비교
  sentences[0]?.forEach(sentence => {
    let similarityCount = 0;
    
    for (let i = 1; i < sentences.length; i++) {
      const maxSimilarity = Math.max(
        ...sentences[i].map(otherSentence => 
          calculateSimilarity(sentence, otherSentence)
        )
      );
      
      if (maxSimilarity > 0.3) { // 30% 이상 유사하면 공통으로 간주
        similarityCount++;
      }
    }
    
    if (similarityCount >= Math.ceil((texts.length - 1) * 0.5)) {
      commonSentences.push(sentence);
    }
  });
  
  return commonSentences.slice(0, 3); // 최대 3개 문장
}

// AI 응답들을 분석하여 요약을 생성하는 메인 함수
export function generateSummary(providerResults: ProviderResult[]): string {
  // 성공한 응답들만 필터링
  const successfulResults = providerResults.filter(result => 
    result.status === 'success' && result.output_text.trim().length > 0
  );
  
  if (successfulResults.length === 0) {
    return '모든 AI 모델이 응답에 실패했습니다.';
  }
  
  if (successfulResults.length === 1) {
    return '단일 AI 모델만 응답했습니다.';
  }
  
  const texts = successfulResults.map(result => result.output_text);
  
  // 공통 키워드 추출
  const commonKeywords = findCommonKeywords(texts);
  
  // 공통 문장 추출
  const commonSentences = findCommonSentences(texts);
  
  // 요약 생성
  let summary = '';
  
  if (commonSentences.length > 0) {
    summary += '📋 **공통된 주요 내용:**\n';
    commonSentences.forEach((sentence, index) => {
      summary += `${index + 1}. ${sentence.trim()}\n`;
    });
  }
  
  if (commonKeywords.length > 0) {
    summary += '\n🔑 **공통 키워드:** ';
    summary += commonKeywords.join(', ');
  }
  
  // 응답 통계
  summary += `\n\n📊 **응답 통계:** ${successfulResults.length}개 AI 모델이 응답했습니다.`;
  
  // 각 모델별 간단한 요약
  summary += '\n\n🤖 **모델별 요약:**\n';
  successfulResults.forEach(result => {
    const modelName = result.provider_name.toUpperCase();
    const preview = result.output_text.substring(0, 100).replace(/\n/g, ' ');
    summary += `• ${modelName}: ${preview}${result.output_text.length > 100 ? '...' : ''}\n`;
  });
  
  return summary.trim();
}

// 요약의 품질을 평가하는 함수
export function evaluateSummaryQuality(summary: string): 'high' | 'medium' | 'low' {
  if (summary.includes('공통된 주요 내용:') && summary.includes('공통 키워드:')) {
    return 'high';
  } else if (summary.includes('공통 키워드:') || summary.includes('공통된 주요 내용:')) {
    return 'medium';
  } else {
    return 'low';
  }
}
