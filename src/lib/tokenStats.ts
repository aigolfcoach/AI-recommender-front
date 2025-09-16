// 토큰 사용량 통계를 관리하는 유틸리티
import { prisma } from './prisma';

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

// 데이터베이스 기반 저장소
class TokenStatsStore {
  // 토큰 사용량 기록 추가
  async addRecord(record: Omit<TokenUsageRecord, 'id' | 'timestamp'> & { timestamp?: Date }) {
    const newRecord = await prisma.tokenUsage.create({
      data: {
        provider: record.provider,
        model: record.model,
        tokens: record.tokens,
        userId: record.userId,
        createdAt: record.timestamp || new Date(),
      },
    });
    
    return {
      id: newRecord.id,
      provider: newRecord.provider,
      model: newRecord.model,
      tokens: newRecord.tokens,
      timestamp: newRecord.createdAt,
      userId: newRecord.userId,
    };
  }

  // 특정 기간의 통계 조회 (사용자별 필터링)
  async getStats(startDate?: Date, endDate?: Date, userId?: string | null): Promise<TokenStats> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 기본 30일
    const end = endDate || new Date();

    // 사용자별 필터링 조건
    const whereCondition = {
      createdAt: {
        gte: start,
        lte: end,
      },
      // 사용자 ID가 제공된 경우에만 해당 사용자의 기록만 조회
      ...(userId ? { userId } : {})
    };

    // 데이터베이스에서 해당 기간의 기록 조회
    const records = await prisma.tokenUsage.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTokens = records.reduce((sum: number, record: any) => sum + record.tokens, 0);
    const totalRequests = records.length;

    // 모델별 통계 계산
    const modelMap = new Map<string, ModelStats>();
    
    records.forEach((record: any) => {
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
      if (!stats.lastUsed || record.createdAt > stats.lastUsed) {
        stats.lastUsed = record.createdAt;
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
  async getAllRecords() {
    const records = await prisma.tokenUsage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return records.map((record: any) => ({
      id: record.id,
      provider: record.provider,
      model: record.model,
      tokens: record.tokens,
      timestamp: record.createdAt,
      userId: record.userId,
    }));
  }

  // 기록 초기화 (테스트용)
  async clearRecords() {
    await prisma.tokenUsage.deleteMany();
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
  
  const baseName = modelNames[provider] || provider;
  
  // 모델 버전 정보 추가
  const modelVersions: { [key: string]: string } = {
    'gpt-4o': 'GPT-4o',
    'gpt-4': 'GPT-4',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'grok-2': 'Grok-2',
    'grok-1': 'Grok-1',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-pro': 'Gemini Pro'
  };
  
  const version = modelVersions[model] || model;
  return `${baseName} (${version})`;
}
