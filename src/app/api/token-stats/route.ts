import { NextRequest, NextResponse } from 'next/server';
import { tokenStatsStore } from '@/lib/tokenStats';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Token stats API 호출됨');
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    console.log('📊 요청된 기간:', days, '일');

    // 기간 설정
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    console.log('📅 조회 기간:', {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    // 통계 조회 (이제 async 함수)
    console.log('🔍 데이터베이스에서 통계 조회 중...');
    const stats = await tokenStatsStore.getStats(startDate, endDate);
    
    console.log('✅ 통계 조회 완료:', {
      totalTokens: stats.totalTokens,
      totalRequests: stats.totalRequests,
      modelCount: stats.modelStats.length
    });

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

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('❌ Token stats API error:', error);
    
    // 더 자세한 에러 정보 제공
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('에러 상세:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    return NextResponse.json(
      { 
        error: "통계 조회 중 오류가 발생했습니다.",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
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
