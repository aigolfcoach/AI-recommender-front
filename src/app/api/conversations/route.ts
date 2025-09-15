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
        responses: {
          create: responses.map((res: any) => ({
            providerName: res.provider_name,
            model: res.model,
            status: res.status,
            outputText: res.output_text,
            latencyMs: res.latency_ms,
            tokens: res.tokens || null,
            error: res.error || null,
          })),
        },
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

    const total = await prisma.conversation.count();

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
