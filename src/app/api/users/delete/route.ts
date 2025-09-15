import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ 사용자 계정 삭제 요청 시작');

    // 토큰 검증
    const token = request.cookies.get('token')?.value;
    if (!token) {
      console.log('❌ 토큰이 없습니다');
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log('❌ 유효하지 않은 토큰');
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    console.log('👤 삭제할 사용자 ID:', userId);

    // 사용자 존재 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tokenUsages: true
      }
    });

    if (!existingUser) {
      console.log('❌ 사용자를 찾을 수 없습니다');
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('📊 삭제될 토큰 사용 기록 수:', existingUser.tokenUsages.length);

    // 트랜잭션으로 사용자와 관련 데이터 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 토큰 사용 기록 삭제 (CASCADE로 자동 삭제되지만 명시적으로 삭제)
      await tx.tokenUsage.deleteMany({
        where: { userId: userId }
      });

      // 2. 사용자 삭제
      await tx.user.delete({
        where: { id: userId }
      });
    });

    console.log('✅ 사용자 계정 삭제 완료');

    // 응답 생성 (쿠키 제거)
    const response = NextResponse.json(
      {
        message: '계정이 성공적으로 삭제되었습니다.',
        success: true
      },
      { status: 200 }
    );

    // 인증 쿠키 제거
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 즉시 만료
    });

    return response;

  } catch (error) {
    console.error('❌ 사용자 계정 삭제 오류:', error);
    
    return NextResponse.json(
      { 
        error: '계정 삭제 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
