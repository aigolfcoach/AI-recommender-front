import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 대화 기록 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, systemPrompt, temperature, maxTokens, responses } = body;

    console.log('💾 대화 기록 저장:', { question, responses: responses?.length });

    // 입력값 검증
    if (!question || !responses) {
      return NextResponse.json(
        { error: '질문과 응답이 필요합니다.' },
        { status: 400 }
      );
    }

    // 대화 기록 저장 (인증 없이도 저장 가능)
    const conversation = await prisma.conversation.create({
      data: {
        question,
        systemPrompt: systemPrompt || null,
        temperature: temperature || 0.2,
        maxTokens: maxTokens || 1024,
        userId: null, // 인증 없이 사용하므로 null
        responses: responses, // JSON으로 직접 저장
      },
    });

    console.log('✅ 대화 기록 저장 완료:', conversation.id);

    return NextResponse.json({
      message: '대화 기록이 저장되었습니다.',
      conversationId: conversation.id,
    });

  } catch (error) {
    console.error('💥 대화 기록 저장 오류:', error);
    return NextResponse.json(
      { error: '대화 기록 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 대화 기록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📖 대화 기록 조회:', { limit, offset });

    const conversations = await prisma.conversation.findMany({
      where: {
        AND: [
          { summary: { not: null } },
          { reliabilityScore: { not: null } },
          { reliabilityGrade: { not: null } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        question: true,
        systemPrompt: true,
        temperature: true,
        maxTokens: true,
        responses: true,
        createdAt: true,
        summary: true,
        reliabilityScore: true,
        reliabilityGrade: true,
      },
    });

    const total = await prisma.conversation.count({
      where: {
        AND: [
          { summary: { not: null } },
          { reliabilityScore: { not: null } },
          { reliabilityGrade: { not: null } }
        ]
      }
    });

    console.log('✅ 대화 기록 조회 완료:', conversations.length);

    return NextResponse.json({
      conversations,
      total,
      hasMore: offset + limit < total,
    });

  } catch (error) {
    console.error('💥 대화 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '대화 기록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 불완전한 대화 기록 삭제
export async function DELETE() {
  try {
    console.log('🧹 불완전한 대화 기록 삭제 시작...');
    
    // 요약이나 신뢰도가 없는 대화 기록 삭제
    const deleteResult = await prisma.conversation.deleteMany({
      where: {
        OR: [
          { summary: null },
          { reliabilityScore: null },
          { reliabilityGrade: null }
        ]
      }
    });
    
    console.log(`✅ 삭제된 불완전한 로그: ${deleteResult.count}개`);
    
    return NextResponse.json({
      message: '불완전한 대화 기록이 삭제되었습니다.',
      deletedCount: deleteResult.count
    });
    
  } catch (error) {
    console.error('💥 불완전한 대화 기록 삭제 오류:', error);
    return NextResponse.json(
      { error: '불완전한 대화 기록 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
