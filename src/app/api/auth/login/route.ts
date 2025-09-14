import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    console.log('🔐 로그인 시도:', { email: body.email });

    // 입력값 검증
    if (!body.email || !body.password) {
      console.log('❌ 입력값 누락');
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    console.log('👤 사용자 찾기:', { email: body.email, userFound: !!user });

    if (!user) {
      console.log('❌ 사용자 없음');
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    console.log('🔑 비밀번호 확인:', { 
      inputPassword: body.password, 
      storedPassword: user.password.substring(0, 10) + '...',
      isValid: isPasswordValid 
    });
    
    if (!isPasswordValid) {
      console.log('❌ 비밀번호 불일치');
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성 (Edge Runtime 호환)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    console.log('✅ 로그인 성공:', { userId: user.id, email: user.email });

    // 응답에서 비밀번호 제거
    const { password, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        message: '로그인이 완료되었습니다.',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

    // 토큰을 쿠키에 설정
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7일
    });

    console.log('🍪 쿠키 설정 완료');

    return response;

  } catch (error) {
    console.error('💥 로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
