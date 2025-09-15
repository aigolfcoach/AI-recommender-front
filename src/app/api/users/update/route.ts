import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 사용자 정보 업데이트 API 호출 시작');
    
    // 요청 본문 파싱
    const body = await request.json();
    const { name, email, password } = body;
    
    console.log('📝 업데이트 요청 데이터:', { name, email, password: password ? '[비밀번호 제공됨]' : '[비밀번호 없음]' });
    
    // 토큰에서 사용자 ID 추출
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('❌ 인증 토큰이 없습니다');
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }
    
    // JWT 토큰 검증
    const tokenData = await verifyToken(token);
    if (!tokenData) {
      console.error('❌ 유효하지 않은 토큰');
      return NextResponse.json({ error: '유효하지 않은 토큰입니다' }, { status: 401 });
    }
    
    const userId = tokenData.userId;
    console.log('✅ 토큰 검증 성공, 사용자 ID:', userId);
    
    // 업데이트할 데이터 준비
    const updateData: any = {};
    
    if (name && name.trim()) {
      updateData.name = name.trim();
    }
    
    if (email && email.trim()) {
      // 이메일 중복 확인
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.trim(),
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        console.error('❌ 이미 사용 중인 이메일:', email);
        return NextResponse.json({ error: '이미 사용 중인 이메일입니다' }, { status: 400 });
      }
      
      updateData.email = email.trim();
    }
    
    if (password && password.trim()) {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password.trim(), 12);
      updateData.password = hashedPassword;
    }
    
    // 업데이트할 데이터가 없으면 오류 반환
    if (Object.keys(updateData).length === 0) {
      console.error('❌ 업데이트할 데이터가 없습니다');
      return NextResponse.json({ error: '업데이트할 정보가 없습니다' }, { status: 400 });
    }
    
    console.log('💾 업데이트할 데이터:', updateData);
    
    // 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log('✅ 사용자 정보 업데이트 성공:', updatedUser);
    
    return NextResponse.json({
      success: true,
      message: '사용자 정보가 성공적으로 업데이트되었습니다',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('❌ 사용자 정보 업데이트 오류:', error);
    
    if (error instanceof Error) {
      // Prisma 오류 처리
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: '이미 사용 중인 이메일입니다' }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: '사용자 정보 업데이트 중 오류가 발생했습니다',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
