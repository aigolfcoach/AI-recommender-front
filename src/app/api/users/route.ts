import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // password는 제외
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const userCount = users.length;

    return NextResponse.json({
      message: '사용자 목록 조회 성공',
      userCount,
      users,
      note: '이 데이터는 PostgreSQL 데이터베이스에 저장됩니다.'
    });

  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
