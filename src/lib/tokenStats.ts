// 토큰 사용량 통계를 관리하는 유틸리티

export interface TokenUsageRecord {
  id: string;
  provider: string;
  model: string;
  tokens: number;
  timestamp: Date;
  userId?: string;
}

export interface ModelStats {
  provider: string;
  model: string;
  totalTokens: number;
  requestCount: number;
  averageTokensPerRequest: number;
  lastUsed?: Date;
}

export interface TokenStats {
  totalTokens: number;
  totalRequests: number;
  modelStats: ModelStats[];
  period: {
    start: Date;
    end: Date;
  };
}

// 메모리 기반 저장소 (실제 프로덕션에서는 데이터베이스 사용)
class TokenStatsStore {
  private records: TokenUsageRecord[] = [];

  // 토큰 사용량 기록 추가
  addRecord(record: Omit<TokenUsageRecord, 'id' | 'timestamp'> & { timestamp?: Date }) {
    const newRecord: TokenUsageRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: record.timestamp || new Date(),
      provider: record.provider,
      model: record.model,
      tokens: record.tokens,
      userId: record.userId,
    };
    this.records.push(newRecord);
    return newRecord;
  }

  // 특정 기간의 통계 조회
  getStats(startDate?: Date, endDate?: Date): TokenStats {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 기본 30일
    const end = endDate || new Date();

    const filteredRecords = this.records.filter(record => 
      record.timestamp >= start && record.timestamp <= end
    );

    const totalTokens = filteredRecords.reduce((sum, record) => sum + record.tokens, 0);
    const totalRequests = filteredRecords.length;

    // 모델별 통계 계산
    const modelMap = new Map<string, ModelStats>();
    
    filteredRecords.forEach(record => {
      const key = `${record.provider}-${record.model}`;
      if (!modelMap.has(key)) {
        modelMap.set(key, {
          provider: record.provider,
          model: record.model,
          totalTokens: 0,
          requestCount: 0,
          averageTokensPerRequest: 0,
        });
      }
      
      const stats = modelMap.get(key)!;
      stats.totalTokens += record.tokens;
      stats.requestCount += 1;
      stats.averageTokensPerRequest = stats.totalTokens / stats.requestCount;
      
      // 마지막 사용 시간 업데이트
      if (!stats.lastUsed || record.timestamp > stats.lastUsed) {
        stats.lastUsed = record.timestamp;
      }
    });

    return {
      totalTokens,
      totalRequests,
      modelStats: Array.from(modelMap.values()),
      period: { start, end },
    };
  }

  // 모든 기록 조회 (디버깅용)
  getAllRecords() {
    return [...this.records];
  }

  // 기록 초기화 (테스트용)
  clearRecords() {
    this.records = [];
  }
}

// 싱글톤 인스턴스
export const tokenStatsStore = new TokenStatsStore();


// 모델 이름을 한국어로 변환
export function getModelDisplayName(provider: string, model: string): string {
  const modelNames: { [key: string]: string } = {
    'openai': 'ChatGPT',
    'grok': 'Grok',
    'gemini': 'Gemini'
  };
  return modelNames[provider] || provider;
}
