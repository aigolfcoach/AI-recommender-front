# 📌 AI Model Recommender

다양한 AI 모델을 통합하여 동시에 질문에 대한 답변을 받고 비교할 수 있는 웹 플랫폼입니다.

---

## 📸 스크린샷
| 메인화면 | 채팅화면 | 관리자화면 |
|----------|----------|------------|
| ![](./screenshots/main.png) | ![](./screenshots/chat.png) | ![](./screenshots/admin.png) |

---

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **AI Providers**: OpenAI, Grok (xAI), Google Gemini
- **Package Manager**: pnpm

---

## ✨ 주요 기능

### 🤖 AI 모델 통합
- **OpenAI GPT-4o**: 최신 GPT 모델 지원
- **Grok (xAI)**: 엑스AI의 Grok 모델 지원  
- **Google Gemini**: 구글의 Gemini 모델 지원
- **동시 응답**: 여러 AI 모델이 동시에 질문에 답변
- **응답 비교**: 각 모델의 답변을 나란히 비교 가능

### 💬 채팅 기능
- **실시간 채팅**: AI 모델들과 실시간 대화
- **파라미터 조정**: Temperature, Max Tokens 등 세부 설정
- **시스템 프롬프트**: 각 대화에 맞는 시스템 프롬프트 설정
- **대화 기록**: 모든 대화 내용 자동 저장
- **신뢰도 분석**: AI 응답의 신뢰도 점수 및 등급 제공

### 📊 사용자 관리
- **회원가입/로그인**: JWT 기반 인증 시스템
- **프로필 관리**: 사용자 정보 및 프로필 이미지 관리
- **토큰 사용량 추적**: 각 모델별 토큰 사용량 통계
- **대화 로그**: 개인별 대화 기록 조회

### 🔧 관리자 기능
- **모델 관리**: AI 모델 설정 및 관리
- **사용자 통계**: 전체 사용자 및 토큰 사용량 통계
- **관리자 인증**: 별도의 관리자 로그인 시스템

---

## ⚙️ 설치 및 실행 방법 (로컬 환경)

```bash
# 1. 레포 클론
git clone https://github.com/username/ai-model-recommender.git

# 2. 디렉토리 이동
cd ai-model-recommender

# 3. 의존성 설치
pnpm install

# 4. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 다음 변수들을 설정하세요:
# DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
# OPENAI_API_KEY="your_openai_api_key"
# XAI_API_KEY="your_xai_api_key"
# GEMINI_API_KEY="your_gemini_api_key"
# JWT_SECRET="your_jwt_secret"

# 5. 데이터베이스 설정
pnpm prisma generate
pnpm prisma db push

# 6. 관리자 계정 생성 (선택사항)
node scripts/create-admin.js

# 7. 개발 서버 실행
pnpm dev

# 8. 브라우저에서 http://localhost:3000 접속
```

---

## 🗂️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── auth/          # 인증 관련 API
│   │   ├── conversations/ # 대화 관리 API
│   │   ├── aggregate/     # AI 모델 통합 API
│   │   └── token-stats/   # 토큰 통계 API
│   ├── admin/             # 관리자 페이지
│   ├── user/              # 사용자 페이지
│   └── login/             # 로그인 페이지
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 및 설정
└── middleware.ts          # Next.js 미들웨어
```

---

## 🔑 환경변수

```env
# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# AI API 키
OPENAI_API_KEY="your_openai_api_key"
XAI_API_KEY="your_xai_api_key"  
GEMINI_API_KEY="your_gemini_api_key"

# JWT 시크릿
JWT_SECRET="your_jwt_secret"

# AI 모델 설정 (선택사항)
OPENAI_MODEL="gpt-4o"
XAI_MODEL="grok-beta"
GEMINI_MODEL="gemini-1.5-pro"
```

---

## 📝 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/admin-login` - 관리자 로그인

### AI 통합
- `POST /api/aggregate` - 여러 AI 모델에 동시 질문

### 사용자 관리
- `GET /api/users/me` - 현재 사용자 정보
- `PUT /api/users/update` - 사용자 정보 수정
- `DELETE /api/users/delete` - 사용자 삭제

### 대화 관리
- `GET /api/conversations` - 대화 목록 조회
- `GET /api/conversations/[id]` - 특정 대화 조회

### 통계
- `GET /api/token-stats` - 토큰 사용량 통계
- `GET /api/admin/stats` - 관리자 통계

---

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경변수 설정 (Vercel 대시보드에서)
```

### Docker 배포
```bash
# Docker 이미지 빌드
docker build -t ai-model-recommender .

# 컨테이너 실행
docker run -p 3000:3000 ai-model-recommender
```

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
