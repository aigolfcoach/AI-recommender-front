'use client';

import { useState } from 'react';

interface ProviderResult {
  provider_name: string;
  model: string;
  latency_ms: number;
  status: string;
  http_status?: number;
  tokens?: number;
  cost_estimate?: number;
  output_text: string;
  error?: string;
}

interface AggregateResponse {
  providers: ProviderResult[];
  meta: {
    duration_ms: number;
    cached: boolean;
  };
}

export default function ChatPage() {
  const [question, setQuestion] = useState('');
  const [system, setSystem] = useState('');
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [responses, setResponses] = useState<AggregateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showParameterInfo, setShowParameterInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/aggregate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          system: system.trim() || null,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get responses');
      }

      const data: AggregateResponse = await response.json();
      setResponses(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get AI responses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async (providerName: string) => {
    if (!responses) return;
    
    const result = responses.providers.find(p => p.provider_name === providerName);
    
    if (result && result.output_text) {
      try {
        await navigator.clipboard.writeText(result.output_text);
        alert('Response copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    }
  };

  const retryRequest = () => {
    if (question.trim()) {
      handleSubmit(new Event('submit') as any);
    }
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
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">Chat with AI</p>
            </div>

            {/* AI Responses */}
            {responses && (
              <div className="p-4">
                <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">AI Responses</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {responses.providers.map((result) => {
                    const providerNames: { [key: string]: string } = {
                      'openai': 'ChatGPT',
                      'grokxai': 'Grok', 
                      'gemini': 'Gemini'
                    };
                    
                    return (
                      <div key={result.provider_name} className="bg-white border border-[#d4dce2] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[#101518] text-base font-bold leading-tight">
                            {providerNames[result.provider_name] || result.provider_name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-[#5c758a] text-xs">
                              {result.latency_ms.toFixed(0)}ms
                            </span>
                            <button 
                              onClick={() => copyResponse(result.provider_name)}
                              className="text-[#9cc0de] hover:text-[#101518] text-xs"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          {result.status === 'success' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              ✅ Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              ❌ {result.status}
                            </span>
                          )}
                          {result.tokens && (
                            <span className="text-[#5c758a] text-xs ml-2">{result.tokens} tokens</span>
                          )}
                        </div>
                        
                        <div className={`text-sm text-[#101518] leading-normal ${
                          result.status === 'success' ? '' : 'text-red-500'
                        }`}>
                          {result.status === 'success' ? result.output_text : (result.error || 'No response')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-6">
                  <button 
                    onClick={retryRequest}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">🔄 Retry Request</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap items-end gap-4 py-3">
                  <label className="flex flex-col w-full">
                    <p className="text-[#101518] text-base font-medium leading-normal pb-2">Question</p>
                    <textarea 
                      id="question" 
                      name="question" 
                      rows={3} 
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-20 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                      placeholder="Enter your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-[#101518] text-base font-medium leading-normal pb-2">System Prompt (Optional)</p>
                      <input 
                        type="text" 
                        id="system" 
                        name="system"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                        placeholder="System instructions..."
                        value={system}
                        onChange={(e) => setSystem(e.target.value)}
                      />
                    </label>
                  </div>
                  
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-[#101518] text-base font-medium leading-normal pb-2">Temperature</p>
                      <input 
                        type="number" 
                        id="temperature" 
                        name="temperature" 
                        min="0" 
                        max="2" 
                        step="0.1" 
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                      />
                    </label>
                  </div>
                  
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="flex flex-col w-full">
                      <p className="text-[#101518] text-base font-medium leading-normal pb-2">Max Tokens</p>
                      <input 
                        type="number" 
                        id="maxTokens" 
                        name="maxTokens" 
                        min="1" 
                        max="8192" 
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex py-3">
                  <button 
                    type="submit" 
                    disabled={loading || !question.trim()}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#9cc0de] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">
                      {loading ? 'Processing...' : 'Send to All Providers'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* 파라미터 설명 토글 */}
            <div className="p-4">
              <button
                onClick={() => setShowParameterInfo(!showParameterInfo)}
                className="flex items-center gap-2 text-[#5c758a] text-sm font-medium hover:text-[#101518] transition-colors"
              >
                <span>{showParameterInfo ? '▼' : '▶'}</span>
                <span>AI 모델 파라미터 설명</span>
              </button>
              
              {showParameterInfo && (
                <div className="mt-4 space-y-4">
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <h4 className="text-[#101518] text-base font-bold mb-2">System Prompt (시스템 프롬프트)</h4>
                    <p className="text-[#5c758a] text-sm leading-relaxed mb-2">
                      AI 모델에게 역할과 행동 방식을 지시하는 지시사항입니다.
                    </p>
                    <ul className="text-[#5c758a] text-sm space-y-1">
                      <li>• <strong>역할 정의:</strong> "당신은 전문 프로그래머입니다"와 같이 AI의 역할을 명시</li>
                      <li>• <strong>응답 스타일:</strong> "간결하고 명확하게 답변해주세요"와 같이 답변 방향 설정</li>
                      <li>• <strong>컨텍스트 제공:</strong> 특정 도메인이나 상황에 대한 배경 정보 제공</li>
                      <li>• <strong>선택사항:</strong> 비워두면 기본 설정으로 동작</li>
                    </ul>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 text-xs font-medium mb-1">예시:</p>
                      <p className="text-blue-700 text-xs">"당신은 친절한 코딩 도우미입니다. 코드 예시를 포함하여 설명해주세요."</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <h4 className="text-[#101518] text-base font-bold mb-2">Temperature (온도)</h4>
                    <p className="text-[#5c758a] text-sm leading-relaxed mb-2">
                      AI 응답의 창의성과 예측 가능성을 조절하는 파라미터입니다.
                    </p>
                    <ul className="text-[#5c758a] text-sm space-y-1">
                      <li>• <strong>0.0 - 0.3:</strong> 매우 일관적이고 예측 가능한 응답 (사실적 정보, 기술 문서)</li>
                      <li>• <strong>0.4 - 0.7:</strong> 균형잡힌 창의성과 일관성 (일반적인 대화, 문제 해결)</li>
                      <li>• <strong>0.8 - 1.0:</strong> 높은 창의성과 다양성 (창작, 브레인스토밍)</li>
                      <li>• <strong>1.1 - 2.0:</strong> 매우 창의적이고 예측하기 어려운 응답 (실험적 창작)</li>
                    </ul>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-800 font-medium">낮은 온도 (0.1-0.3)</p>
                        <p className="text-green-700">정확한 정보, 코딩, 번역</p>
                      </div>
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-blue-800 font-medium">중간 온도 (0.4-0.7)</p>
                        <p className="text-blue-700">일반 대화, 문제 해결</p>
                      </div>
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 font-medium">높은 온도 (0.8-1.0)</p>
                        <p className="text-yellow-700">창작, 스토리텔링</p>
                      </div>
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-800 font-medium">매우 높은 온도 (1.1-2.0)</p>
                        <p className="text-red-700">실험적 창작</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <h4 className="text-[#101518] text-base font-bold mb-2">Max Tokens (최대 토큰 수)</h4>
                    <p className="text-[#5c758a] text-sm leading-relaxed mb-2">
                      AI가 생성할 수 있는 최대 응답 길이를 제한합니다. 토큰은 대략 단어나 문자 단위입니다.
                    </p>
                    <ul className="text-[#5c758a] text-sm space-y-1">
                      <li>• <strong>토큰 계산:</strong> 한국어 1토큰 ≈ 1-2글자, 영어 1토큰 ≈ 0.75단어</li>
                      <li>• <strong>짧은 응답 (100-500):</strong> 간단한 답변, 요약, 키워드</li>
                      <li>• <strong>중간 응답 (500-1500):</strong> 일반적인 설명, 단락 형태</li>
                      <li>• <strong>긴 응답 (1500-4000):</strong> 상세한 설명, 여러 단락</li>
                      <li>• <strong>매우 긴 응답 (4000+):</strong> 긴 문서, 상세한 가이드</li>
                    </ul>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-[#5c758a]">100 토큰</span>
                        <span className="text-xs text-[#5c758a]">≈ 1-2 문장</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-[#5c758a]">500 토큰</span>
                        <span className="text-xs text-[#5c758a]">≈ 1-2 단락</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-[#5c758a]">1000 토큰</span>
                        <span className="text-xs text-[#5c758a]">≈ 3-5 단락</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-[#5c758a]">2000+ 토큰</span>
                        <span className="text-xs text-[#5c758a]">≈ 긴 문서</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-[#d4dce2] rounded-lg p-4">
                    <h4 className="text-[#101518] text-base font-bold mb-2">권장 설정 조합</h4>
                    <p className="text-[#5c758a] text-sm leading-relaxed mb-3">
                      용도별로 권장하는 파라미터 조합입니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-800 font-medium mb-1">📚 학습/정보</p>
                        <p className="text-green-700 text-xs">Temperature: 0.2, Max Tokens: 1000</p>
                        <p className="text-green-600 text-xs">정확하고 일관된 정보 제공</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-blue-800 font-medium mb-1">💬 일반 대화</p>
                        <p className="text-blue-700 text-xs">Temperature: 0.5, Max Tokens: 800</p>
                        <p className="text-blue-600 text-xs">자연스럽고 균형잡힌 대화</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 font-medium mb-1">🎨 창작/아이디어</p>
                        <p className="text-yellow-700 text-xs">Temperature: 0.8, Max Tokens: 1500</p>
                        <p className="text-yellow-600 text-xs">창의적이고 다양한 아이디어</p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-purple-800 font-medium mb-1">🔧 코딩/기술</p>
                        <p className="text-purple-700 text-xs">Temperature: 0.1, Max Tokens: 2000</p>
                        <p className="text-purple-600 text-xs">정확한 코드와 상세한 설명</p>
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