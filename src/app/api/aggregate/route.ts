import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { tokenStatsStore } from '@/lib/tokenStats';
import { generateSummary } from '@/lib/summarizer';
import { calculateReliability, getReliabilityGrade } from '@/lib/reliability';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Types from llms project
interface AggregateRequest {
  question: string;
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

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

// Configuration - 환경변수에서 가져오거나 기본값 사용
const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '<YOUR_OPENAI_API_KEY>',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o'
  },
  grok: {
    apiKey: process.env.XAI_API_KEY || '<YOUR_XAI_API_KEY>',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-2'
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '<YOUR_GEMINI_API_KEY>',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash'
  },
  timeout: 20000,
  maxRetries: 2
};

// Base Provider Class
abstract class BaseProvider {
  constructor(
    public name: string,
    public apiKey: string,
    public baseUrl: string,
    public model: string,
    public timeout: number = 20000
  ) {}

  abstract makeRequest(prompt: string, system?: string, temperature?: number, maxTokens?: number): Promise<any>;
  abstract extractResponse(responseData: any): { text: string; tokens?: number };

  async send(
    prompt: string,
    system?: string,
    temperature: number = 0.2,
    maxTokens: number = 1024
  ): Promise<ProviderResult> {
    const startTime = Date.now();
    
    try {
      const responseData = await this.makeRequest(prompt, system, temperature, maxTokens);
      const { text, tokens } = this.extractResponse(responseData);
      const latencyMs = Date.now() - startTime;
      
      return {
        provider_name: this.name,
        model: this.model,
        latency_ms: latencyMs,
        status: "success",
        http_status: 200,
        tokens,
        output_text: text
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      
      if (error.code === 'ECONNABORTED') {
        return {
          provider_name: this.name,
          model: this.model,
          latency_ms: latencyMs,
          status: "timeout",
          output_text: "",
          error: "Request timeout"
        };
      }
      
      return {
        provider_name: this.name,
        model: this.model,
        latency_ms: latencyMs,
        status: "error",
        http_status: error.response?.status,
        output_text: "",
        error: error.response?.data?.error?.message || error.message || "Unknown error"
      };
    }
  }
}

// OpenAI Provider
class OpenAIProvider extends BaseProvider {
  async makeRequest(prompt: string, system?: string, temperature: number = 0.2, maxTokens: number = 1024) {
    const messages = [];
    if (system) {
      messages.push({ role: "system", content: system });
    }
    messages.push({ role: "user", content: prompt });
    
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages,
        temperature,
        max_tokens: maxTokens
      },
      {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: this.timeout
      }
    );
    
    return response.data;
  }

  extractResponse(responseData: any): { text: string; tokens?: number } {
    const text = responseData.choices[0].message.content;
    const tokens = responseData.usage?.total_tokens;
    return { text, tokens };
  }
}

// Grok (xAI) Provider
class GrokProvider extends BaseProvider {
  async makeRequest(prompt: string, system?: string, temperature: number = 0.2, maxTokens: number = 1024) {
    const messages = [];
    if (system) {
      messages.push({ role: "system", content: system });
    }
    messages.push({ role: "user", content: prompt });
    
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      },
      {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: this.timeout
      }
    );
    
    return response.data;
  }

  extractResponse(responseData: any): { text: string; tokens?: number } {
    const text = responseData.choices[0].message.content;
    const tokens = responseData.usage?.total_tokens;
    return { text, tokens };
  }
}

// Gemini Provider
class GeminiProvider extends BaseProvider {
  async makeRequest(prompt: string, system?: string, temperature: number = 0.2, maxTokens: number = 1024) {
    const contents = [];
    if (system) {
      contents.push({ parts: [{ text: system }], role: "user" });
      contents.push({ parts: [{ text: "I understand. I'll follow these instructions." }], role: "model" });
    }
    contents.push({ parts: [{ text: prompt }], role: "user" });
    
    const response = await axios.post(
      `${this.baseUrl}/models/${this.model}:generateContent`,
      {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          candidateCount: 1
        }
      },
      {
        params: { key: this.apiKey },
        headers: {
          "Content-Type": "application/json"
        },
        timeout: this.timeout
      }
    );
    
    return response.data;
  }

  extractResponse(responseData: any): { text: string; tokens?: number } {
    const candidates = responseData.candidates || [];
    if (candidates.length === 0) {
      return { text: "No response generated" };
    }
    
    const text = candidates[0].content.parts[0].text;
    const tokens = responseData.usageMetadata?.totalTokenCount;
    return { text, tokens };
  }
}

// Mock Provider for testing
class MockProvider extends BaseProvider {
  async makeRequest(prompt: string, system?: string, temperature: number = 0.2, maxTokens: number = 1024) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const responses = {
      openai: `ChatGPT Response: ${prompt.substring(0, 100)}... This is a comprehensive response from OpenAI's GPT model, providing detailed insights and analysis.`,
      grok: `Grok Response: ${prompt.substring(0, 100)}... This response comes from xAI's Grok model, known for its real-time information access and humorous style.`,
      gemini: `Gemini Response: ${prompt.substring(0, 100)}... This is Google's multimodal AI response, capable of processing text, images, and audio simultaneously.`
    };
    
    return {
      choices: [{ message: { content: responses[this.name as keyof typeof responses] || `Response from ${this.name}` } }],
      usage: { total_tokens: Math.floor(Math.random() * 500) + 200 }
    };
  }

  extractResponse(responseData: any): { text: string; tokens?: number } {
    return {
      text: responseData.choices[0].message.content,
      tokens: responseData.usage?.total_tokens
    };
  }
}

function generateConsensusSummary(results: ProviderResult[]): ConsensusResponse {
  const successful_results = results.filter(r => r.status === "success");
  
  if (successful_results.length === 0) {
    return {
      summary: "All providers failed to generate responses.",
      common_points: [],
      differences: ["All requests failed"],
      cautions: ["Unable to provide consensus due to provider failures"]
    };
  }

  const success_count = successful_results.length;
  const provider_names = successful_results.map(r => r.provider_name);
  const avg_latency = successful_results.reduce((sum, r) => sum + r.latency_ms, 0) / successful_results.length;

  return {
    summary: `Consensus from ${success_count} providers (${provider_names.join(', ')}): Responses show convergence on key topics with varying detail levels. Average response time: ${avg_latency.toFixed(0)}ms.`,
    common_points: ["AI", "response", "analysis", "information", "model"],
    differences: successful_results.map(r => `${r.provider_name}: ${r.output_text.length} chars, ${r.latency_ms.toFixed(0)}ms`),
    cautions: results.filter(r => r.status !== "success").map(r => `${r.provider_name}: ${r.error || r.status}`)
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AggregateRequest = await request.json();
    
    if (!body.question || body.question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const start_time = Date.now();

    // Check if we should use mock providers (when API keys are not set)
    const useMockProviders = 
      config.openai.apiKey.includes('<YOUR_') ||
      config.grok.apiKey.includes('<YOUR_') ||
      config.gemini.apiKey.includes('<YOUR_');

    // Initialize providers
    const providers = useMockProviders ? [
      new MockProvider("openai", "", "", config.openai.model, config.timeout),
      new MockProvider("grok", "", "", config.grok.model, config.timeout),
      new MockProvider("gemini", "", "", config.gemini.model, config.timeout)
    ] : [
      new OpenAIProvider("openai", config.openai.apiKey, config.openai.baseUrl, config.openai.model, config.timeout),
      new GrokProvider("grok", config.grok.apiKey, config.grok.baseUrl, config.grok.model, config.timeout),
      new GeminiProvider("gemini", config.gemini.apiKey, config.gemini.baseUrl, config.gemini.model, config.timeout)
    ];

    // Call all providers in parallel
    const provider_results = await Promise.all(
      providers.map(provider => 
        provider.send(
          body.question,
          body.system,
          body.temperature || 0.2,
          body.max_tokens || 1024
        )
      )
    );

    // Generate consensus summary
    const consensus = generateConsensusSummary(provider_results);

    // 토큰 사용량 통계 저장
    provider_results.forEach(result => {
      if (result.status === 'success' && result.tokens && result.tokens > 0) {
        tokenStatsStore.addRecord({
          provider: result.provider_name,
          model: result.model,
          tokens: result.tokens,
          userId: 'current-user' // 실제로는 인증된 사용자 ID 사용
        });
      }
    });

    const duration_ms = Date.now() - start_time;

    const response: AggregateResponse = {
      consensus,
      providers: provider_results,
      meta: {
        duration_ms,
        cached: false
      }
    };

    // 사용자 인증 확인 및 대화 기록 저장
    const token = request.cookies.get('token')?.value;
    let userId: string | null = null;
    
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // 대화 기록 저장 (인증된 사용자만)
    if (userId) {
      try {
        // AI 응답들을 분석하여 요약 생성
        const summary = generateSummary(provider_results);
        
        // AI 응답들의 신뢰도 계산
        const reliability = calculateReliability(provider_results);
        const reliabilityGrade = getReliabilityGrade(reliability.overall);
        
        await prisma.conversation.create({
          data: {
            question: body.question,
            systemPrompt: body.system || null,
            temperature: body.temperature || 0.2,
            maxTokens: body.max_tokens || 1024,
            userId: userId,
            summary: summary,
            reliabilityScore: reliability.overall,
            reliabilityGrade: reliabilityGrade.grade,
            responses: {
              create: provider_results.map(result => ({
                providerName: result.provider_name,
                model: result.model,
                status: result.status,
                outputText: result.output_text,
                latencyMs: result.latency_ms,
                tokens: result.tokens || null,
                error: result.error || null
              }))
            }
          }
        });
        
        console.log('✅ 대화 기록 저장 완료 (요약 및 신뢰도 포함)');
      } catch (dbError) {
        console.error('💥 대화 기록 저장 실패:', dbError);
        // 데이터베이스 오류가 있어도 API 응답은 계속 진행
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Aggregate API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}