import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 대화 기록 조회
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        responses: {
          select: {
            providerName: true,
            model: true,
            status: true,
            outputText: true,
            latencyMs: true,
            tokens: true,
            error: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // 전체 개수 조회
    const total = await prisma.conversation.count({
      where: {
        userId: decoded.userId
      }
    });

    return NextResponse.json({
      conversations,
      total,
      hasMore: offset + limit < total
    });

  } catch (error) {
    console.error('대화 기록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { question, systemPrompt, temperature, maxTokens, responses } = body;

    // 대화 기록 생성
    const conversation = await prisma.conversation.create({
      data: {
        question,
        systemPrompt: systemPrompt || null,
        temperature: temperature || 0.2,
        maxTokens: maxTokens || 1024,
        userId: decoded.userId,
        responses: {
          create: responses.map((response: any) => ({
            providerName: response.provider_name,
            model: response.model,
            status: response.status,
            outputText: response.output_text,
            latencyMs: response.latency_ms,
            tokens: response.tokens || null,
            error: response.error || null
          }))
        }
      },
      include: {
        responses: true
      }
    });

    return NextResponse.json({
      message: '대화 기록이 저장되었습니다.',
      conversation
    });

  } catch (error) {
    console.error('대화 기록 저장 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
