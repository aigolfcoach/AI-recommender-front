'use client';

import { Layout, PageContainer, ContentContainer } from '@/components/Layout';
import { Header, Logo, Navigation, NavLinks, NavLink } from '@/components/Header';

export default function About() {
  return (
    <Layout>
      <Header>
        <Logo />
        <Navigation>
          <NavLinks>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
          </NavLinks>
          <a
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d4dce2] transition-colors"
          >
            <span className="truncate">Log In</span>
          </a>
        </Navigation>
      </Header>
      <PageContainer>
        <ContentContainer maxWidth="lg">
          <div className="px-4 py-8">
            <h1 className="text-[#101518] tracking-light text-[48px] font-bold leading-tight text-center pb-8">
              About AI Model Recommender
            </h1>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {/* 프로젝트 개요 */}
              <section className="bg-white rounded-lg p-8 shadow-sm border border-[#eaeef1]">
                <h2 className="text-[#101518] text-2xl font-bold leading-tight mb-4">프로젝트 개요</h2>
                <p className="text-[#5c758a] text-lg leading-relaxed">
                  AI Model Recommender는 다양한 AI 모델을 비교하고 추천하는 웹 서비스입니다. 
                  사용자는 ChatGPT, Grok, Gemini 등 여러 AI 모델을 통해 질문에 대한 답변을 받을 수 있으며, 
                  각 모델의 성능과 특성을 비교해볼 수 있습니다.
                </p>
              </section>

              {/* 주요 기능 */}
              <section className="bg-white rounded-lg p-8 shadow-sm border border-[#eaeef1]">
                <h2 className="text-[#101518] text-2xl font-bold leading-tight mb-6">주요 기능</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-[#101518] text-lg font-semibold mb-2">다중 AI 모델 지원</h3>
                        <p className="text-[#5c758a] text-sm leading-relaxed">
                          ChatGPT, Grok, Gemini 등 다양한 AI 모델을 지원하여 사용자가 원하는 모델을 선택할 수 있습니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-[#101518] text-lg font-semibold mb-2">실시간 채팅</h3>
                        <p className="text-[#5c758a] text-sm leading-relaxed">
                          선택한 AI 모델과 실시간으로 대화하며 질문과 답변을 주고받을 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-[#101518] text-lg font-semibold mb-2">사용량 통계</h3>
                        <p className="text-[#5c758a] text-sm leading-relaxed">
                          개인별 토큰 사용량과 질문 횟수를 추적하여 사용 패턴을 분석할 수 있습니다.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-[#101518] text-lg font-semibold mb-2">관리자 대시보드</h3>
                        <p className="text-[#5c758a] text-sm leading-relaxed">
                          관리자는 전체 사용자 통계와 모델 관리 기능을 통해 서비스를 모니터링할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 기술 스택 */}
              <section className="bg-white rounded-lg p-8 shadow-sm border border-[#eaeef1]">
                <h2 className="text-[#101518] text-2xl font-bold leading-tight mb-6">기술 스택</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#f3f4f6] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#101518] text-xl font-bold">Next.js</span>
                    </div>
                    <h3 className="text-[#101518] font-semibold mb-2">Frontend</h3>
                    <p className="text-[#5c758a] text-sm">React 기반의 풀스택 프레임워크</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#f3f4f6] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#101518] text-xl font-bold">Prisma</span>
                    </div>
                    <h3 className="text-[#101518] font-semibold mb-2">Database</h3>
                    <p className="text-[#5c758a] text-sm">PostgreSQL과 ORM</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#f3f4f6] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#101518] text-xl font-bold">JWT</span>
                    </div>
                    <h3 className="text-[#101518] font-semibold mb-2">Authentication</h3>
                    <p className="text-[#5c758a] text-sm">토큰 기반 인증 시스템</p>
                  </div>
                </div>
              </section>

              {/* 사용 방법 */}
              <section className="bg-white rounded-lg p-8 shadow-sm border border-[#eaeef1]">
                <h2 className="text-[#101518] text-2xl font-bold leading-tight mb-6">사용 방법</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-[#f8fafc] rounded-lg">
                    <div className="w-8 h-8 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <p className="text-[#5c758a]">회원가입 또는 로그인을 진행합니다.</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-[#f8fafc] rounded-lg">
                    <div className="w-8 h-8 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <p className="text-[#5c758a]">원하는 AI 모델을 선택합니다.</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-[#f8fafc] rounded-lg">
                    <div className="w-8 h-8 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <p className="text-[#5c758a]">질문을 입력하고 AI의 답변을 받아봅니다.</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-[#f8fafc] rounded-lg">
                    <div className="w-8 h-8 bg-[#9cc0de] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <p className="text-[#5c758a]">사용 통계를 확인하고 계정을 관리합니다.</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
}
