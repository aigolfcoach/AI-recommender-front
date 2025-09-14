import { NextRequest, NextResponse } from 'next/server';
import { tokenStatsStore } from '@/lib/tokenStats';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // 기간 설정
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 통계 조회
    const stats = tokenStatsStore.getStats(startDate, endDate);

    // 응답 데이터 포맷팅
    const response = {
      ...stats,
      period: {
        start: stats.period.start.toISOString(),
        end: stats.period.end.toISOString(),
      },
      modelStats: stats.modelStats.map(stat => ({
        ...stat,
        lastUsed: stat.lastUsed?.toISOString(),
        displayName: getModelDisplayName(stat.provider, stat.model),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Token stats API error:', error);
    return NextResponse.json(
      { error: "통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 모델 이름을 한국어로 변환하는 헬퍼 함수
function getModelDisplayName(provider: string, model: string): string {
  const modelNames: { [key: string]: string } = {
    'openai': 'ChatGPT',
    'grok': 'Grok', 
    'gemini': 'Gemini'
  };
  return modelNames[provider] || provider;
}
