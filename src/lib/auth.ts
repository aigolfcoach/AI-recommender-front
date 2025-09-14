import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

/**
 * JWT 토큰을 생성합니다
 */
export async function createJWTToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
  
  return await new SignJWT({ 
    userId: user.id, 
    email: user.email 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * 응답에 인증 쿠키를 설정합니다
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7일
  });
}

/**
 * 사용자 객체에서 비밀번호를 제거합니다
 */
export function removePasswordFromUser(user: User): Omit<User, 'password'> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * 성공적인 인증 응답을 생성합니다
 */
export function createAuthResponse(
  user: User, 
  token: string, 
  message: string,
  status: number = 200
): NextResponse {
  const userWithoutPassword = removePasswordFromUser(user);
  
  const response = NextResponse.json(
    {
      message,
      user: userWithoutPassword,
      token
    },
    { status }
  );

  setAuthCookie(response, token);
  return response;
}

/**
 * 이메일 형식을 검증합니다
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호를 검증합니다
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 6) {
    return {
      isValid: false,
      error: '비밀번호는 최소 6자 이상이어야 합니다.'
    };
  }
  
  return { isValid: true };
}

/**
 * 입력값을 검증합니다
 */
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): { isValid: boolean; error?: string } {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim().length === 0) {
      return {
        isValid: false,
        error: '모든 필드를 입력해주세요.'
      };
    }
  }
  
  return { isValid: true };
}
