import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { 
  createJWTToken, 
  createAuthResponse, 
  validateRequiredFields, 
  validateEmail,
  validatePassword,
  User 
} from '@/lib/auth';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();

    // 입력값 검증
    const validation = validateRequiredFields(body, ['name', 'email', 'password', 'confirmPassword']);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    if (!body.agreeToTerms) {
      return NextResponse.json(
        { error: '이용약관에 동의해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 확인
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 검증
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      }
    });

    // JWT 토큰 생성
    const token = await createJWTToken(user as User);

    return createAuthResponse(user as User, token, '회원가입이 완료되었습니다.', 201);

  } catch (error) {
    console.error('회원가입 오류:', error);
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
