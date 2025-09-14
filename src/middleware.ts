import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  console.log('🔍 미들웨어 실행:', { 
    path: request.nextUrl.pathname, 
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
  });

  // 공개 경로 (로그인, 회원가입 페이지)
  const publicPaths = ['/', '/login', '/admin/login'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // 공개 API 경로 (인증이 필요하지 않은 API)
  const publicApiPaths = ['/api/auth/signup', '/api/auth/login', '/api/auth/admin-login', '/api/auth/logout', '/api/users'];
  const isPublicApiPath = publicApiPaths.includes(request.nextUrl.pathname);

  // API 경로
  const isApiPath = request.nextUrl.pathname.startsWith('/api/');

  // 공개 경로나 공개 API는 인증 없이 통과
  if (isPublicPath || isPublicApiPath) {
    console.log('✅ 공개 경로 통과:', request.nextUrl.pathname);
    return NextResponse.next();
  }

  if (!token) {
    console.log('❌ 토큰 없음, 리다이렉션:', request.nextUrl.pathname);
    if (isApiPath) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Edge Runtime에서 JWT 검증 (비동기 처리)
  return jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key'))
    .then((decoded) => {
      console.log('✅ 토큰 검증 성공:', { 
        userId: decoded.payload.userId, 
        email: decoded.payload.email 
      });
      
      // 요청 헤더에 사용자 정보 추가
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.payload.userId as string);
      requestHeaders.set('x-user-email', decoded.payload.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    })
    .catch((error) => {
      console.log('❌ 토큰 검증 실패:', error.message);
      if (isApiPath) {
        return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
