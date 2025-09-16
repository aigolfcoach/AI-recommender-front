'use client';

import { useState, useEffect } from 'react';

interface ModelStats {
  provider: string;
  model: string;
  totalTokens: number;
  requestCount: number;
  averageTokensPerRequest: number;
  lastUsed?: string;
  displayName: string;
}

interface TokenStats {
  totalTokens: number;
  totalRequests: number;
  modelStats: ModelStats[];
  period: {
    start: string;
    end: string;
  };
}

export default function ModelsPage() {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const fetchTokenStats = async (days: number) => {
    try {
      setError(null); // 에러 상태 초기화
      console.log('🔍 토큰 통계 조회 시작:', days, '일');
      
      const params = new URLSearchParams({
        days: days.toString()
      });
      
      const response = await fetch(`/api/token-stats?${params}`);
      console.log('📡 API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API 에러 응답:', errorData);
        const errorMessage = `통계 조회에 실패했습니다. (${response.status}): ${errorData.details || errorData.error || '알 수 없는 오류'}`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ 통계 데이터 수신:', data);
      setTokenStats(data);
    } catch (error) {
      console.error('❌ Error fetching token stats:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setTokenStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenStats(selectedPeriod);
  }, [selectedPeriod]);


  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getTotalPercentage = (tokens: number) => {
    if (!tokenStats || tokenStats.totalTokens === 0) return 0;
    return Math.round((tokens / tokenStats.totalTokens) * 100);
  };
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{
        fontFamily: 'Inter, "Noto Sans", sans-serif'
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101518]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">AI Model Recommender</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/chat">Chat</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/log">Log</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/models">Models</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/account">Account</a>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_K4oCZnObXGSEG0-NXOK_66V9AhGZt1rQjp9fA3Bq9LC_vtDC1lxyptjHHJE1rCpu2PvhhM2WlNACsD5t6fwUAK7igjl881UdEdevunfuzjFwUbxTsRpgSMKC0p74a2rvnGgbUoCSfoZDlsiAgvqd15PDlr_gXDy374YWSklBGsRK1Uxlr59Qoi3IWJO2BhTco7IVLELsrcyGI80caHb2FHjez35yRE6OvMkuB-elDtWRQf11jenV7Wqw_rr6yggAlRKU4CUYcmM")'
              }}
            ></div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">AI Model Descriptions & Token Usage</p>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Model Information</h3>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <div className="flex items-center gap-2">
                    <p className="text-[#101518] text-base font-bold leading-tight">ChatGPT</p>
                    <span className="text-[#5c758a] text-xs font-medium bg-gray-100 px-2 py-1 rounded">GPT-4o</span>
                  </div>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">OpenAI의 대화형 AI 모델로 자연스러운 대화, 창작, 코딩, 분석 등 다양한 작업에 뛰어난 성능을 보입니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/chatgpt-logo.webp")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <div className="flex items-center gap-2">
                    <p className="text-[#101518] text-base font-bold leading-tight">Grok</p>
                    <span className="text-[#5c758a] text-xs font-medium bg-gray-100 px-2 py-1 rounded">Grok-2</span>
                  </div>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">xAI에서 개발한 AI 모델로 실시간 정보 접근과 유머러스한 대화 스타일이 특징이며, 최신 정보를 바탕으로 답변합니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/grok-logo.png")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <div className="flex items-center gap-2">
                    <p className="text-[#101518] text-base font-bold leading-tight">Gemini</p>
                    <span className="text-[#5c758a] text-xs font-medium bg-gray-100 px-2 py-1 rounded">Gemini 1.5 Flash</span>
                  </div>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">Google의 멀티모달 AI 모델로 텍스트, 이미지, 오디오를 동시에 처리하며, 창의적 작업과 추론에 특화되어 있습니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/gemini-logo.jpg")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">토큰 사용량 통계</h3>
            
            {/* 기간 선택 */}
            <div className="flex items-center gap-4 px-4 pb-4">
              <div className="flex items-center gap-2">
                <label className="text-[#101518] text-sm font-medium">기간:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                  className="px-3 py-1 border border-[#d4dce2] rounded-lg text-sm"
                >
                  <option value={7}>최근 7일</option>
                  <option value={30}>최근 30일</option>
                  <option value={90}>최근 90일</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-[#5c758a]">통계를 불러오는 중...</div>
              </div>
            ) : error ? (
              <div className="px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-red-500 text-xl">⚠️</div>
                    <h4 className="text-red-800 font-semibold">통계 조회 실패</h4>
                  </div>
                  <p className="text-red-700 text-sm mb-4">{error}</p>
                  <button 
                    onClick={() => fetchTokenStats(selectedPeriod)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : tokenStats ? (
              <div className="px-4 space-y-6">
                {/* 전체 통계 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <p className="text-[#5c758a] text-sm font-medium">전체 토큰 사용량</p>
                    <p className="text-[#101518] text-2xl font-bold">{formatNumber(tokenStats.totalTokens)}</p>
                    <p className="text-[#5c758a] text-xs">지난 {selectedPeriod}일간</p>
                  </div>
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <p className="text-[#5c758a] text-sm font-medium">전체 요청 수</p>
                    <p className="text-[#101518] text-2xl font-bold">{formatNumber(tokenStats.totalRequests)}</p>
                    <p className="text-[#5c758a] text-xs">지난 {selectedPeriod}일간</p>
                  </div>
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <p className="text-[#5c758a] text-sm font-medium">평균 토큰/요청</p>
                    <p className="text-[#101518] text-2xl font-bold">
                      {tokenStats.totalRequests > 0 ? formatNumber(Math.round(tokenStats.totalTokens / tokenStats.totalRequests)) : '0'}
                    </p>
                    <p className="text-[#5c758a] text-xs">요청당 평균</p>
                  </div>
                </div>

                {/* 모델별 상세 통계 */}
                <div className="bg-white border border-[#d4dce2] rounded-lg p-6">
                  <h4 className="text-[#101518] text-lg font-bold mb-4">모델별 토큰 사용량</h4>
                  {tokenStats.modelStats.length > 0 ? (
                    <div className="space-y-4">
                      {tokenStats.modelStats.map((modelStat, index) => (
                        <div key={index} className="border-b border-[#eaeef1] pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h5 className="text-[#101518] font-semibold">{modelStat.displayName}</h5>
                              <span className="text-[#5c758a] text-sm">
                                {getTotalPercentage(modelStat.totalTokens)}% 사용
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[#101518] font-bold">{formatNumber(modelStat.totalTokens)} 토큰</p>
                              <p className="text-[#5c758a] text-sm">{formatNumber(modelStat.requestCount)}회 요청</p>
                            </div>
                          </div>
                          
                          {/* 진행률 바 */}
                          <div className="w-full bg-[#eaeef1] rounded-full h-2">
                            <div 
                              className="bg-[#9cc0de] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getTotalPercentage(modelStat.totalTokens)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-[#5c758a] mt-1">
                            <span>평균 {formatNumber(Math.round(modelStat.averageTokensPerRequest))} 토큰/요청</span>
                            {modelStat.lastUsed && (
                              <span>마지막 사용: {formatDate(modelStat.lastUsed)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#5c758a]">
                      <p>토큰 사용량 데이터가 없습니다.</p>
                      <p className="text-sm mt-1">채팅을 시작하여 토큰 사용량을 추적해보세요.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#5c758a]">
                <p>통계를 불러올 수 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
