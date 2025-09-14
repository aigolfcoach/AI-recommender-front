import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: '로그아웃이 완료되었습니다.' },
      { status: 200 }
    );

    // 쿠키에서 토큰 제거
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 즉시 만료
    });

    return response;

  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
