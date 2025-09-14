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

interface ConsensusResponse {
  summary: string;
  common_points: string[];
  differences: string[];
  cautions: string[];
}

interface AggregateResponse {
  consensus: ConsensusResponse;
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

      // 대화 기록 저장
      try {
        await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question.trim(),
            systemPrompt: system.trim() || null,
            temperature,
            maxTokens,
            responses: data.providers,
          }),
        });
        console.log('✅ 대화 기록 저장 완료');
      } catch (saveError) {
        console.error('대화 기록 저장 실패:', saveError);
        // 저장 실패해도 사용자에게는 알리지 않음
      }
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

            {/* Consensus Summary */}
            {responses && (
              <div className="p-4">
                <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">Consensus Summary</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="mb-3 text-[#101518]">
                    <strong>Summary:</strong> {responses.consensus.summary}
                  </div>
                  
                  {responses.consensus.common_points.length > 0 && (
                    <div className="mb-3 text-[#101518]">
                      <strong>Common Points:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {responses.consensus.common_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {responses.consensus.differences.length > 0 && (
                    <div className="mb-3 text-[#101518]">
                      <strong>Differences:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {responses.consensus.differences.map((diff, index) => (
                          <li key={index}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {responses.consensus.cautions.length > 0 && (
                    <div className="mb-3 text-[#101518]">
                      <strong>Cautions:</strong>
                      <ul className="list-disc list-inside ml-2 text-yellow-700">
                        {responses.consensus.cautions.map((caution, index) => (
                          <li key={index}>{caution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
}