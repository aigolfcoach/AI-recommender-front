import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { 
  createJWTToken, 
  createAuthResponse, 
  validateRequiredFields, 
  validateEmail,
  User 
} from '@/lib/auth';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    console.log('🔐 로그인 시도:', { email: body.email });

    // 입력값 검증
    const validation = validateRequiredFields(body, ['email', 'password']);
    if (!validation.isValid) {
      console.log('❌ 입력값 누락');
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!validateEmail(body.email)) {
      console.log('❌ 이메일 형식 오류');
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
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

    // JWT 토큰 생성
    const token = await createJWTToken(user as User);

    console.log('✅ 로그인 성공:', { userId: user.id, email: user.email });
    console.log('🍪 쿠키 설정 완료');

    return createAuthResponse(user as User, token, '로그인이 완료되었습니다.');

  } catch (error) {
    console.error('💥 로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
