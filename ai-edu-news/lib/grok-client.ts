/**
 * xAI Grok API Client
 * Grok-4-1-fast 모델을 사용한 파인만 스타일 뉴스 생성
 */

import OpenAI from 'openai';

// xAI Grok API (OpenAI SDK 호환)
const grokClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// Fallback: OpenAI GPT-4
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RawNews {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'AI' | 'Education' | 'AI+Education';
  country: 'KR' | 'US';
}

export interface FeynmanArticle {
  feynmanTitle: string;
  feynmanSummary: string;
  feynmanContent: string;
  questions: Array<{
    question: string;
    reasoning: string;
    type: 'principle' | 'application' | 'opposite';
  }>;
  tags: string[];
  targetAudience: 'teacher' | 'student' | 'parent';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  educationContext: string;
}

/**
 * 파인만 스타일 기사 생성 (Grok 사용)
 */
export async function generateFeynmanArticle(
  rawNews: RawNews,
  language: 'ko' | 'en' = 'ko'
): Promise<FeynmanArticle> {
  try {
    // Grok으로 먼저 시도
    return await generateWithGrok(rawNews, language);
  } catch (error) {
    console.error('Grok API 오류, GPT-4로 fallback:', error);
    // 실패 시 GPT-4로 fallback
    return await generateWithGPT4(rawNews, language);
  }
}

/**
 * xAI Grok으로 생성
 */
async function generateWithGrok(
  rawNews: RawNews,
  language: 'ko' | 'en'
): Promise<FeynmanArticle> {
  const prompt = createFeynmanPrompt(rawNews, language);

  const response = await grokClient.chat.completions.create({
    model: 'grok-beta', // 또는 'grok-4-1-fast' (모델명 확인 필요)
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(language),
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return validateFeynmanArticle(result);
}

/**
 * OpenAI GPT-4로 생성 (Fallback)
 */
async function generateWithGPT4(
  rawNews: RawNews,
  language: 'ko' | 'en'
): Promise<FeynmanArticle> {
  const prompt = createFeynmanPrompt(rawNews, language);

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(language),
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return validateFeynmanArticle(result);
}

/**
 * 시스템 프롬프트 (언어별)
 */
function getSystemPrompt(language: 'ko' | 'en'): string {
  if (language === 'ko') {
    return `당신은 리처드 파인만 교수입니다.

파인만 교수의 특징:
- 복잡한 개념을 초등학생도 이해할 수 있게 설명하는 천재
- 열정적이고 호기심이 넘치는 교육자
- 일상적인 비유와 스토리텔링을 즐겨 사용
- "왜?"라는 질문을 끊임없이 던지는 과학자
- 항상 본질을 꿰뚫는 통찰력

당신의 역할:
AI와 교육 관련 뉴스를 교사와 학생들이 쉽게 이해할 수 있도록
파인만 기법으로 재작성하세요.`;
  } else {
    return `You are Professor Richard Feynman.

Feynman's characteristics:
- A genius who can explain complex concepts to elementary students
- Passionate and curious educator
- Uses everyday analogies and storytelling
- Constantly asks "Why?"
- Always penetrates to the essence

Your role:
Rewrite AI and education news using the Feynman Technique
so teachers and students can easily understand.`;
  }
}

/**
 * 파인만 프롬프트 생성
 */
function createFeynmanPrompt(rawNews: RawNews, language: 'ko' | 'en'): string {
  if (language === 'ko') {
    return `다음 뉴스를 파인만 기법으로 재작성하세요:

**원본 뉴스:**
제목: ${rawNews.title}
내용: ${rawNews.content}
출처: ${rawNews.source}
카테고리: ${rawNews.category}

**파인만 기법 4단계:**

1단계: 선택 (무엇을 설명할 것인가)
- 이 뉴스의 핵심 개념을 한 문장으로 정의하세요

2단계: 설명 (12살 아이에게 설명하듯)
- 일상적 비유 사용
- 복잡한 용어 피하기
- 예시와 스토리텔링 활용
- 800-1200자

3단계: 간격 메우기 (어려운 부분 재설명)
- "만약 ~라면?" 질문 활용
- 단계별로 쉽게 풀어쓰기

4단계: 단순화 (핵심만 남기기)
- 결론: 왜 이게 중요한가?
- 교육 현장에서 어떻게 활용할 수 있는가?

**출력 형식 (반드시 JSON):**

\`\`\`json
{
  "feynmanTitle": "궁금증을 유발하는 질문 형식 제목 (30자 이내)",
  "feynmanSummary": "초등학생도 이해 가능한 한 줄 요약 (비유 활용)",
  "feynmanContent": "마크다운 형식 본문 (## 헤더 사용, 800-1200자)",
  "questions": [
    {
      "question": "왜 이게 작동하는 거지?",
      "reasoning": "파인만이 이 질문을 한 이유",
      "type": "principle"
    },
    {
      "question": "이걸 어디에 쓸 수 있을까?",
      "reasoning": "파인만이 이 질문을 한 이유",
      "type": "application"
    },
    {
      "question": "만약 반대라면 어떻게 될까?",
      "reasoning": "파인만이 이 질문을 한 이유",
      "type": "opposite"
    }
  ],
  "tags": ["AI", "교육", "관련키워드"],
  "targetAudience": "teacher",
  "difficultyLevel": 3,
  "educationContext": "이 뉴스가 교육 현장에서 어떻게 활용될 수 있는지 구체적으로 설명"
}
\`\`\`

**톤과 스타일:**
- 🎯 열정적이고 호기심 가득
- 💡 "이건 정말 재미있어요!" 느낌
- 🤔 질문 많이 던지기
- 😊 친근하고 대화하듯`;
  } else {
    return `Rewrite this news using the Feynman Technique:

**Original News:**
Title: ${rawNews.title}
Content: ${rawNews.content}
Source: ${rawNews.source}
Category: ${rawNews.category}

**Feynman Technique 4 Steps:**

Step 1: Choose (What to explain)
- Define the core concept in one sentence

Step 2: Explain (As if to a 12-year-old)
- Use everyday analogies
- Avoid complex terms
- Use examples and storytelling
- 800-1200 words

Step 3: Fill the gaps (Re-explain difficult parts)
- Use "What if?" questions
- Break down step by step

Step 4: Simplify (Keep only essentials)
- Conclusion: Why is this important?
- How can it be used in education?

**Output Format (JSON only):**

\`\`\`json
{
  "feynmanTitle": "Curiosity-provoking question format title (max 60 chars)",
  "feynmanSummary": "One-line summary for elementary students (with metaphor)",
  "feynmanContent": "Markdown format content (use ## headers, 800-1200 words)",
  "questions": [
    {
      "question": "Why does this work?",
      "reasoning": "Why Feynman would ask this",
      "type": "principle"
    },
    {
      "question": "Where can we use this?",
      "reasoning": "Why Feynman would ask this",
      "type": "application"
    },
    {
      "question": "What if it were opposite?",
      "reasoning": "Why Feynman would ask this",
      "type": "opposite"
    }
  ],
  "tags": ["AI", "Education", "related keywords"],
  "targetAudience": "teacher",
  "difficultyLevel": 3,
  "educationContext": "Specific explanation of how this can be used in education"
}
\`\`\`

**Tone and Style:**
- 🎯 Passionate and curious
- 💡 "This is so interesting!" vibe
- 🤔 Ask many questions
- 😊 Friendly and conversational`;
  }
}

/**
 * 생성된 기사 검증
 */
function validateFeynmanArticle(data: any): FeynmanArticle {
  // 필수 필드 체크
  if (!data.feynmanTitle || !data.feynmanContent || !data.questions) {
    throw new Error('Invalid Feynman article structure');
  }

  // 질문이 3개인지 확인
  if (!Array.isArray(data.questions) || data.questions.length !== 3) {
    throw new Error('Must have exactly 3 Feynman questions');
  }

  return {
    feynmanTitle: data.feynmanTitle,
    feynmanSummary: data.feynmanSummary || '',
    feynmanContent: data.feynmanContent,
    questions: data.questions.map((q: any, index: number) => ({
      question: q.question,
      reasoning: q.reasoning,
      type: index === 0 ? 'principle' : index === 1 ? 'application' : 'opposite',
    })),
    tags: data.tags || [],
    targetAudience: data.targetAudience || 'teacher',
    difficultyLevel: data.difficultyLevel || 3,
    educationContext: data.educationContext || '',
  };
}

/**
 * 비용 계산 (참고용)
 */
export function estimateCost(inputTokens: number, outputTokens: number): {
  grok: number;
  gpt4: number;
} {
  // xAI Grok-4-1-fast 가격 (예상)
  const grokInputCost = (inputTokens / 1000000) * 0.5;  // $0.50/1M tokens
  const grokOutputCost = (outputTokens / 1000000) * 1.5; // $1.50/1M tokens

  // GPT-4 Turbo 가격
  const gpt4InputCost = (inputTokens / 1000000) * 10;   // $10/1M tokens
  const gpt4OutputCost = (outputTokens / 1000000) * 30; // $30/1M tokens

  return {
    grok: grokInputCost + grokOutputCost,
    gpt4: gpt4InputCost + gpt4OutputCost,
  };
}

// 사용 예시:
// const feynman = await generateFeynmanArticle(rawNews, 'ko');
// console.log('생성된 제목:', feynman.feynmanTitle);
