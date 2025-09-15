'use client';

import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  question: string;
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
  responses: Array<{
    provider_name?: string;
    providerName?: string;
    model: string;
    status: string;
    output_text?: string;
    outputText?: string;
    latency_ms?: number;
    latencyMs?: number;
    tokens?: number;
    error?: string;
  }>;
  createdAt: string;
  summary?: string;
  reliabilityScore?: number;
  reliabilityGrade?: string;
}

interface ConversationResponse {
  conversations: Conversation[];
  total: number;
  hasMore: boolean;
}

export default function LogPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'model' | 'classification'>('date');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());
  const [showReliabilityInfo, setShowReliabilityInfo] = useState(false);

  const fetchConversations = async (reset = false) => {
    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: reset ? '0' : offset.toString(),
      });

      const response = await fetch(`/api/conversations?${params}`);
      if (!response.ok) {
        throw new Error('대화 기록 조회에 실패했습니다.');
      }

      const data: ConversationResponse = await response.json();
      
      if (reset) {
        setConversations(data.conversations);
        setOffset(10);
      } else {
        setConversations(prev => [...prev, ...data.conversations]);
        setOffset(prev => prev + 10);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('대화 기록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredConversations = conversations.filter(conv =>
    conv.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModelNames = (responses: Conversation['responses']) => {
    const providerNames: { [key: string]: string } = {
      'openai': 'ChatGPT',
      'grok': 'Grok',
      'gemini': 'Gemini'
    };
    
    return responses
      .filter(r => r.status === 'success')
      .map(r => providerNames[r.provider_name || ''] || r.provider_name || 'Unknown')
      .join(', ');
  };

  const getClassification = (question: string) => {
    // 간단한 분류 로직 (실제로는 더 정교한 분류가 필요)
    if (question.includes('코딩') || question.includes('프로그래밍') || question.includes('개발')) {
      return '개발';
    } else if (question.includes('창작') || question.includes('글쓰기') || question.includes('스토리')) {
      return '창작';
    } else if (question.includes('분석') || question.includes('연구') || question.includes('데이터')) {
      return '분석';
    } else {
      return '일반';
    }
  };

  const toggleConversation = (conversationId: string) => {
    setExpandedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId);
      } else {
        newSet.add(conversationId);
      }
      return newSet;
    });
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
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] py-5 px-4">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">My Conversations</p>
              <a
                href="/user/chat"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#9cc0de] text-[#101518] text-sm font-medium leading-normal hover:bg-[#8bb8d4] transition-colors"
              >
                <span className="truncate">New Chat</span>
              </a>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div
                    className="text-[#5c758a] flex border-none bg-[#eaeef1] items-center justify-center pl-4 rounded-l-lg border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border-none bg-[#eaeef1] focus:border-none h-full placeholder:text-[#5c758a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <button 
                onClick={() => setSortBy('date')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 ${
                  sortBy === 'date' ? 'bg-[#9cc0de]' : 'bg-[#eaeef1]'
                }`}
              >
                <p className="text-[#101518] text-sm font-medium leading-normal">Sort by Date</p>
                <div className="text-[#101518]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button 
                onClick={() => setSortBy('model')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 ${
                  sortBy === 'model' ? 'bg-[#9cc0de]' : 'bg-[#eaeef1]'
                }`}
              >
                <p className="text-[#101518] text-sm font-medium leading-normal">AI Model</p>
                <div className="text-[#101518]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button 
                onClick={() => setSortBy('classification')}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 ${
                  sortBy === 'classification' ? 'bg-[#9cc0de]' : 'bg-[#eaeef1]'
                }`}
              >
                <p className="text-[#101518] text-sm font-medium leading-normal">Classification</p>
                <div className="text-[#101518]" data-icon="CaretDown" data-size="20px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-[#5c758a]">대화 기록을 불러오는 중...</div>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div key={conversation.id} className="bg-white border border-[#d4dce2] rounded-lg mb-4 overflow-hidden">
                  <div 
                    className="flex gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleConversation(conversation.id)}
                  >
                    <div
                      className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaeef1] shrink-0 size-12"
                      data-icon="ChatCircleDots"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <p className="text-[#101518] text-base font-medium leading-normal">
                          {formatDate(conversation.createdAt)}
                        </p>
                        <div className="text-[#5c758a]">
                          {expandedConversations.has(conversation.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M213.66,154.34l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,53.66,165.66L128,91.31l74.34,74.35a8,8,0,0,0,11.32-11.32Z"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-[#5c758a] text-sm font-normal leading-normal">
                        {conversation.question}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#5c758a] text-sm font-normal leading-normal">
                          AI Model: {getModelNames(conversation.responses)}, Classification: {getClassification(conversation.question)}
                        </p>
                        {conversation.reliabilityScore && conversation.reliabilityGrade && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#5c758a]">신뢰도:</span>
                            <span className={`text-sm font-bold ${
                              conversation.reliabilityScore >= 80 ? 'text-green-600' :
                              conversation.reliabilityScore >= 60 ? 'text-blue-600' :
                              conversation.reliabilityScore >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {conversation.reliabilityGrade} ({conversation.reliabilityScore}점)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedConversations.has(conversation.id) && (
                    <div className="border-t border-[#d4dce2] bg-gray-50 p-4">
                      <div className="space-y-4">
                        {/* 요약 섹션 */}
                        {conversation.summary && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-blue-600 font-semibold text-sm">📋 AI 응답 요약</span>
                              <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                                공통 내용
                              </span>
                            </div>
                            <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                              {conversation.summary}
                            </div>
                          </div>
                        )}
                        
                        {/* 개별 AI 응답들 */}
                        {conversation.responses.map((response, index) => {
                          // 필드명을 유연하게 처리
                          const providerName = response.provider_name || response.providerName;
                          const model = response.model;
                          const status = response.status;
                          const outputText = response.output_text || response.outputText;
                          const latencyMs = response.latency_ms || response.latencyMs;
                          const tokens = response.tokens;
                          const error = response.error;
                          
                          const providerDisplayNames: { [key: string]: string } = {
                            'openai': 'ChatGPT',
                            'grok': 'Grok',
                            'gemini': 'Gemini'
                          };
                          
                          return (
                            <div key={index} className="bg-white rounded-lg p-4 border border-[#eaeef1]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-[#101518]">
                                    {providerDisplayNames[providerName || ''] || providerName?.toUpperCase() || 'Unknown'}
                                  </span>
                                  <span className="text-xs text-[#5c758a] bg-[#eaeef1] px-2 py-1 rounded">
                                    {model}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    status === 'success' 
                                      ? 'bg-green-100 text-green-800' 
                                      : status === 'error'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                                <div className="text-xs text-[#5c758a]">
                                  {latencyMs}ms
                                  {tokens && ` • ${tokens} tokens`}
                                </div>
                              </div>
                              <div className="text-sm text-[#101518] leading-relaxed">
                                {status === 'success' ? (
                                  <div className="whitespace-pre-wrap">{outputText}</div>
                                ) : (
                                  <div className="text-red-600 italic">
                                    Error: {error || 'Unknown error occurred'}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#5c758a]">
                <p>대화 기록이 없습니다.</p>
                <p className="text-sm mt-1">새로운 채팅을 시작해보세요!</p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => fetchConversations(false)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d4dce2] transition-colors"
                >
                  <span className="truncate">더 보기</span>
                </button>
              </div>
            )}

            {/* 신뢰도 설명 토글 */}
            <div className="mt-8 border-t border-[#eaeef1] pt-6">
              <button
                onClick={() => setShowReliabilityInfo(!showReliabilityInfo)}
                className="flex items-center justify-between w-full text-left p-4 bg-[#f8f9fa] rounded-lg hover:bg-[#eaeef1] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#101518]">AI 응답 신뢰도 평가 기준</h3>
                    <p className="text-sm text-[#5c758a]">신뢰도 점수가 어떻게 계산되는지 알아보세요</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-[#5c758a] transition-transform ${showReliabilityInfo ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showReliabilityInfo && (
                <div className="mt-4 p-6 bg-white rounded-lg border border-[#eaeef1]">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-[#101518] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        일관성 (Consistency) - 30% 가중치
                      </h4>
                      <div className="ml-8 space-y-2 text-sm text-[#5c758a]">
                        <p>• <strong>응답 간 일치율:</strong> 여러 AI 모델의 응답이 얼마나 유사한지 측정</p>
                        <p>• <strong>성공률:</strong> 전체 요청 중 성공한 응답의 비율</p>
                        <p>• <strong>계산 방식:</strong> Jaccard 유사도로 키워드 기반 유사성 측정</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#101518] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        완성도 (Completeness) - 25% 가중치
                      </h4>
                      <div className="ml-8 space-y-2 text-sm text-[#5c758a]">
                        <p>• <strong>평균 응답 길이:</strong> 100자 이상이면 높은 점수</p>
                        <p>• <strong>최소 길이:</strong> 너무 짧은 응답이 있으면 감점</p>
                        <p>• <strong>충분한 정보 제공:</strong> 상세한 답변일수록 높은 점수</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#101518] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        응답 시간 (Response Time) - 20% 가중치
                      </h4>
                      <div className="ml-8 space-y-2 text-sm text-[#5c758a]">
                        <p>• <strong>5초 이하:</strong> 100점 (매우 빠름)</p>
                        <p>• <strong>5-10초:</strong> 80점 (빠름)</p>
                        <p>• <strong>10-15초:</strong> 60점 (보통)</p>
                        <p>• <strong>15-20초:</strong> 40점 (느림)</p>
                        <p>• <strong>20초 이상:</strong> 20점 (매우 느림)</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#101518] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                        내용 품질 (Content Quality) - 25% 가중치
                      </h4>
                      <div className="ml-8 space-y-2 text-sm text-[#5c758a]">
                        <p>• <strong>구조적 요소:</strong> 문장 구분, 줄바꿈 등 (30점)</p>
                        <p>• <strong>숫자 포함:</strong> 구체적인 데이터나 수치 (20점)</p>
                        <p>• <strong>상세함:</strong> 200자 이상의 충분한 길이 (50점)</p>
                      </div>
                    </div>

                    <div className="border-t border-[#eaeef1] pt-4">
                      <h4 className="font-semibold text-[#101518] mb-3">신뢰도 등급 시스템</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                          <span className="text-[#5c758a]">A+ (90-100점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-green-400 rounded-full"></span>
                          <span className="text-[#5c758a]">A (80-89점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                          <span className="text-[#5c758a]">B+ (70-79점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
                          <span className="text-[#5c758a]">B (60-69점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                          <span className="text-[#5c758a]">C+ (50-59점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                          <span className="text-[#5c758a]">C (40-49점)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                          <span className="text-[#5c758a]">D (0-39점)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}