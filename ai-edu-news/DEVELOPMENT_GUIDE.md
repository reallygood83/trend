# AI 교육 뉴스 플랫폼 - 완전한 개발 가이드

> 이 문서는 다른 AI 또는 개발자가 이 프로젝트를 이어받아 개발할 수 있도록
> 프로젝트의 **A to Z**를 설명합니다.

**📅 작성일**: 2025-11-23
**✍️ 작성자**: Claude (Anthropic)
**🎯 목적**: 프로젝트 인수인계 및 지속적인 개발

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [현재 진행 상황](#2-현재-진행-상황)
3. [코드 구조 상세](#3-코드-구조-상세)
4. [개발 환경 설정](#4-개발-환경-설정)
5. [미완성 작업 목록](#5-미완성-작업-목록)
6. [구현 가이드](#6-구현-가이드)
7. [테스트 가이드](#7-테스트-가이드)
8. [배포 가이드](#8-배포-가이드)
9. [트러블슈팅](#9-트러블슈팅)
10. [참고 자료](#10-참고-자료)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목표

**"교사와 AI 유튜버가 원클릭으로 파인만 스타일 AI/교육 뉴스 콘텐츠를 생산하는 플랫폼"**

### 1.2 핵심 워크플로우

```
[매일 오전 9시 자동 크롤링]
    ↓
[관리자 대시보드에서 뉴스 선택]
    ↓
["생성" 버튼 → xAI Grok으로 파인만 스타일 변환 (30-60초)]
    ↓
[편집기에서 미리보기 + 수동 편집]
    ↓
["발행" 버튼 → 블로그 + Twitter + 뉴스레터 대기열]
    ↓
[매주 일요일 자동 뉴스레터 발송]
```

### 1.3 주요 기술 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG, API Routes |
| **Styling** | TailwindCSS + shadcn/ui | 빠른 개발, 일관성 |
| **Database** | Firebase Firestore | NoSQL, 실시간, 무료 티어 |
| **AI** | xAI Grok-4-1-fast | GPT-4 대비 20배 저렴 |
| **Deployment** | Vercel (FE) + Firebase (BE) | 서버리스, 자동 배포 |
| **Newsletter** | Resend | 3,000 emails 무료 |
| **i18n** | next-intl | 한국어/영어 |

---

## 2. 현재 진행 상황

### 2.1 완성된 부분 ✅

#### 백엔드 인프라 (100% 완료)

| 파일 | 위치 | 상태 | 설명 |
|------|------|------|------|
| Grok API 클라이언트 | `lib/grok-client.ts` | ✅ | 파인만 스타일 생성 함수 |
| Firebase Client | `lib/firebase-client.ts` | ✅ | 클라이언트 SDK |
| Firebase Admin | `lib/firebase-admin.ts` | ✅ | 서버 SDK |
| Firestore 타입 | `types/firestore.ts` | ✅ | TypeScript 타입 정의 |
| 한국 크롤러 | `lib/crawlers/korea-crawler.ts` | ✅ | 6개 소스 RSS |
| 미국 크롤러 | `lib/crawlers/usa-crawler.ts` | ✅ | 8개 소스 RSS |
| 통합 크롤러 | `lib/crawlers/index.ts` | ✅ | 중복 제거, Firestore 저장 |

#### 설정 파일 (100% 완료)

| 파일 | 위치 | 상태 |
|------|------|------|
| package.json | `/package.json` | ✅ |
| tsconfig.json | `/tsconfig.json` | ✅ |
| next.config.js | `/next.config.js` | ✅ |
| tailwind.config.ts | `/tailwind.config.ts` | ✅ |
| .env.example | `/.env.example` | ✅ |
| .gitignore | `/.gitignore` | ✅ |

#### 다국어 (100% 완료)

| 파일 | 위치 | 상태 |
|------|------|------|
| 한국어 번역 | `locales/ko/common.json` | ✅ |
| 영어 번역 | `locales/en/common.json` | ✅ |

#### UI 컴포넌트 (30% 완료)

| 파일 | 위치 | 상태 |
|------|------|------|
| Button | `components/ui/button.tsx` | ✅ |
| Card | `components/ui/card.tsx` | ✅ |
| Badge | `components/ui/badge.tsx` | ✅ |
| globals.css | `app/globals.css` | ✅ |
| utils | `lib/utils.ts` | ✅ |

### 2.2 미완성 부분 ❌

#### 페이지 (0% 완료)

| 페이지 | 경로 | 우선순위 | 상태 |
|--------|------|---------|------|
| 홈 페이지 | `app/[locale]/page.tsx` | P0 | ❌ 필요 |
| 뉴스 목록 | `app/[locale]/posts/page.tsx` | P0 | ❌ 필요 |
| 뉴스 상세 | `app/[locale]/posts/[slug]/page.tsx` | P0 | ❌ 필요 |
| 관리자 대시보드 | `app/[locale]/admin/page.tsx` | P0 | ❌ 필요 |
| 편집기 | `app/[locale]/admin/editor/page.tsx` | P0 | ❌ 필요 |
| 뉴스레터 구독 | `app/[locale]/newsletter/page.tsx` | P1 | ❌ 필요 |

#### API 라우트 (0% 완료)

| API | 경로 | 우선순위 | 상태 |
|-----|------|---------|------|
| 크롤링 트리거 | `app/api/crawl/route.ts` | P0 | ❌ 필요 |
| 파인만 생성 | `app/api/generate/route.ts` | P0 | ❌ 필요 |
| 기사 발행 | `app/api/publish/route.ts` | P0 | ❌ 필요 |
| 뉴스레터 구독 | `app/api/newsletter/subscribe/route.ts` | P1 | ❌ 필요 |

#### Firebase Functions (0% 완료)

| Function | 파일 | 우선순위 | 상태 |
|----------|------|---------|------|
| 스케줄 크롤링 | `functions/src/crawl.ts` | P0 | ❌ 필요 |
| 뉴스레터 발송 | `functions/src/newsletter.ts` | P0 | ❌ 필요 |

#### 컴포넌트 (0% 완료)

| 컴포넌트 | 경로 | 우선순위 | 상태 |
|----------|------|---------|------|
| NewsCard | `components/NewsCard.tsx` | P0 | ❌ 필요 |
| FeynmanQuestionBox | `components/FeynmanQuestionBox.tsx` | P0 | ❌ 필요 |
| LanguageSwitcher | `components/LanguageSwitcher.tsx` | P0 | ❌ 필요 |
| NewsletterForm | `components/NewsletterForm.tsx` | P1 | ❌ 필요 |

---

## 3. 코드 구조 상세

### 3.1 현재 파일 트리

```
ai-edu-news/
├── .git/                       # Git 저장소
├── .gitignore                  # ✅ 완성
├── .env.example                # ✅ 완성
│
├── package.json                # ✅ 완성 (의존성 정의)
├── tsconfig.json               # ✅ 완성
├── next.config.js              # ✅ 완성 (i18n 설정)
├── tailwind.config.ts          # ✅ 완성
│
├── README.md                   # ✅ 완성
├── SPEC.md                     # ✅ 완성 (시스템 사양서)
├── DEVELOPMENT_GUIDE.md        # ✅ 완성 (이 파일)
│
├── app/                        # ❌ Next.js App Router (미구현)
│   ├── globals.css             # ✅ 완성
│   ├── [locale]/               # ❌ 다국어 라우팅 (필요)
│   │   ├── layout.tsx          # ❌ 루트 레이아웃
│   │   ├── page.tsx            # ❌ 홈 페이지
│   │   ├── posts/              # ❌ 블로그
│   │   ├── admin/              # ❌ 관리자
│   │   └── newsletter/         # ❌ 뉴스레터
│   └── api/                    # ❌ API 라우트 (필요)
│       ├── crawl/
│       ├── generate/
│       └── publish/
│
├── components/                 # ⚠️ 일부 완성
│   ├── ui/                     # ✅ 기본 UI (Button, Card, Badge)
│   ├── NewsCard.tsx            # ❌ 필요
│   ├── FeynmanQuestionBox.tsx  # ❌ 필요
│   └── LanguageSwitcher.tsx    # ❌ 필요
│
├── lib/                        # ✅ 대부분 완성
│   ├── firebase-client.ts      # ✅ 완성
│   ├── firebase-admin.ts       # ✅ 완성
│   ├── grok-client.ts          # ✅ 완성 (파인만 생성)
│   ├── utils.ts                # ✅ 완성 (유틸리티)
│   └── crawlers/               # ✅ 완성
│       ├── korea-crawler.ts
│       ├── usa-crawler.ts
│       └── index.ts
│
├── types/                      # ✅ 완성
│   └── firestore.ts            # ✅ Firestore 타입 정의
│
├── locales/                    # ✅ 완성
│   ├── ko/common.json          # ✅ 한국어
│   └── en/common.json          # ✅ 영어
│
└── functions/                  # ❌ Firebase Functions (미구현)
    ├── package.json            # ❌ 필요
    ├── tsconfig.json           # ❌ 필요
    └── src/
        ├── index.ts            # ❌ 진입점
        ├── crawl.ts            # ❌ 크롤링 스케줄러
        └── newsletter.ts       # ❌ 뉴스레터 발송
```

### 3.2 핵심 파일 설명

#### `lib/grok-client.ts` (✅ 완성)

**목적**: xAI Grok API를 사용해 원본 뉴스를 파인만 스타일로 변환

**주요 함수**:
```typescript
// 1. 메인 함수
export async function generateFeynmanArticle(
  rawNews: RawNews,
  language: 'ko' | 'en'
): Promise<FeynmanArticle>

// 2. 내부 구현
async function generateWithGrok(...)  // xAI Grok 사용
async function generateWithGPT4(...)  // Fallback

// 3. 프롬프트 생성
function createFeynmanPrompt(rawNews, language): string

// 4. 검증
function validateFeynmanArticle(data): FeynmanArticle
```

**사용 예시**:
```typescript
import { generateFeynmanArticle } from '@/lib/grok-client';

const rawNews = {
  id: '1',
  title: 'ChatGPT 교육 활용 가이드 발표',
  content: '...',
  source: 'TechCrunch',
  // ...
};

const feynman = await generateFeynmanArticle(rawNews, 'ko');
// → feynman.feynmanTitle: "왜 AI는 우리 숙제를 도와줄 수 있을까?"
// → feynman.questions: [{ question: "...", reasoning: "..." }, ...]
```

**중요**: 환경 변수 `XAI_API_KEY` 필요!

---

#### `lib/crawlers/index.ts` (✅ 완성)

**목적**: 모든 뉴스 소스에서 크롤링 → Firestore 저장

**주요 함수**:
```typescript
// 1. 메인 크롤링 함수
export async function crawlAllNews(): Promise<{
  success: boolean;
  totalNews: number;
  newNews: number;
  errors: string[];
}>

// 2. 오늘 뉴스 조회 (관리자용)
export async function getTodayNews(filters?: {
  category?: "AI" | "Education" | "AI+Education";
  country?: "KR" | "US";
}): Promise<RawNews[]>
```

**사용 예시**:
```typescript
import { crawlAllNews } from '@/lib/crawlers';

// API 라우트에서 호출
const result = await crawlAllNews();
// → { success: true, totalNews: 42, newNews: 38, errors: [] }
```

---

#### `types/firestore.ts` (✅ 완성)

**Firestore 컬렉션 구조**:

```typescript
// 1. raw_news (원본 뉴스)
export interface RawNews {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Timestamp | string;
  category: "AI" | "Education" | "AI+Education";
  country: "KR" | "US";
  status: "pending" | "selected" | "processed" | "published";
  keywords: string[];
}

// 2. feynman_articles (파인만 기사)
export interface FeynmanArticle {
  id: string;
  rawNewsId: string;
  feynmanTitle: string;
  feynmanSummary: string;
  feynmanContent: string;  // Markdown
  questions: Array<{
    question: string;
    reasoning: string;
    type: "principle" | "application" | "opposite";
  }>;
  slug: string;
  tags: string[];
  publishedAt: Timestamp | null;
  status: "draft" | "published";
  platforms: {
    blog: { published: boolean; url: string };
    twitter?: { published: boolean; url: string };
  };
  // ...
}

// 3. newsletters (뉴스레터)
export interface Newsletter {
  id: string;
  title: string;
  articles: string[];  // FeynmanArticle IDs
  sentAt: Timestamp | null;
  status: "draft" | "scheduled" | "sent";
  openRate: number;
  clickRate: number;
}

// 4. subscribers (구독자)
export interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  preferences: {
    frequency: "weekly" | "biweekly";
    language: "ko" | "en";
  };
}
```

---

## 4. 개발 환경 설정

### 4.1 필수 계정 생성

| 서비스 | 용도 | 가입 링크 | 무료 한도 |
|--------|------|----------|-----------|
| **Firebase** | Firestore + Functions + Auth | https://console.firebase.google.com | 50K reads/day |
| **xAI** | Grok API | https://x.ai/ | 종량제 |
| **Vercel** | 프론트엔드 호스팅 | https://vercel.com | 100GB/month |
| **Resend** | 이메일 발송 | https://resend.com | 3,000 emails/month |
| **GitHub** | 코드 저장소 | https://github.com | 무제한 |

### 4.2 로컬 개발 환경 설정

#### Step 1: 저장소 클론

```bash
git clone https://github.com/reallygood83/masteroflearning.git
cd masteroflearning/ai-edu-news
```

#### Step 2: 의존성 설치

```bash
npm install
```

#### Step 3: 환경 변수 설정

```bash
cp .env.example .env
nano .env  # 실제 값 입력
```

**필수 환경 변수**:

```bash
# xAI Grok (https://x.ai/api)
XAI_API_KEY=your_xai_api_key_here

# Firebase Client (Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (Firebase Console → Service Accounts → Generate Key)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Resend (https://resend.com/api-keys)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=newsletter@yourdomain.com

# 관리자 이메일
ADMIN_EMAIL=your-email@example.com
```

#### Step 4: Firebase 초기화

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 연결
firebase use --add
# → 프로젝트 선택
```

#### Step 5: 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 열기

---

## 5. 미완성 작업 목록

### 5.1 우선순위 P0 (MVP 필수)

#### 작업 1: 홈 페이지 (`app/[locale]/page.tsx`)

**요구사항**:
- 최신 뉴스 6개 카드 형식으로 표시
- 뉴스레터 구독 폼 (이메일 입력)
- 언어 선택기 (한국어/English)
- 반응형 (모바일/태블릿/데스크톱)

**구현 예시**:
```typescript
// app/[locale]/page.tsx

import { getTranslations } from 'next-intl/server';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/types/firestore';
import NewsCard from '@/components/NewsCard';
import NewsletterForm from '@/components/NewsletterForm';

export default async function HomePage({ params: { locale } }) {
  const t = await getTranslations('common');

  // 최신 발행된 기사 6개 조회
  const snapshot = await adminDb
    .collection(COLLECTIONS.FEYNMAN_ARTICLES)
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(6)
    .get();

  const articles = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="feynman-title text-5xl mb-4">
          {t('site.title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('site.tagline')}
        </p>

        {/* 뉴스레터 구독 */}
        <NewsletterForm />
      </section>

      {/* 최신 뉴스 */}
      <section>
        <h2 className="text-3xl font-bold mb-8">{t('nav.posts')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} locale={locale} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href={`/${locale}/posts`} className="text-primary hover:underline">
            {t('buttons.readMore')} →
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

#### 작업 2: API - 파인만 생성 (`app/api/generate/route.ts`)

**요구사항**:
- 뉴스 ID 배열 받기 (최대 10개)
- Grok API로 파인만 스타일 변환
- Firestore에 저장
- 30-60초 타임아웃 처리

**구현 예시**:
```typescript
// app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { generateFeynmanArticle } from '@/lib/grok-client';
import { COLLECTIONS, RawNews } from '@/types/firestore';
import { generateSlug } from '@/lib/utils';
import admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { newsIds, language = 'ko' } = await request.json();

    if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
      return NextResponse.json(
        { error: '뉴스 ID가 필요합니다' },
        { status: 400 }
      );
    }

    if (newsIds.length > 10) {
      return NextResponse.json(
        { error: '최대 10개까지 선택 가능합니다' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // 각 뉴스별로 파인만 생성 (순차 처리)
    for (const newsId of newsIds) {
      try {
        // 1. 원본 뉴스 조회
        const newsDoc = await adminDb
          .collection(COLLECTIONS.RAW_NEWS)
          .doc(newsId)
          .get();

        if (!newsDoc.exists) {
          errors.push({ newsId, error: '뉴스를 찾을 수 없습니다' });
          continue;
        }

        const rawNews = newsDoc.data() as RawNews;

        // 2. Grok API로 파인만 생성 (30-60초 소요)
        const feynmanData = await generateFeynmanArticle(
          { ...rawNews, id: newsId },
          language
        );

        // 3. Firestore에 저장
        const articleRef = await adminDb
          .collection(COLLECTIONS.FEYNMAN_ARTICLES)
          .add({
            ...feynmanData,
            rawNewsId: newsId,
            slug: generateSlug(feynmanData.feynmanTitle),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            publishedAt: null,
            status: 'draft',
            platforms: {
              blog: { published: false, url: '' },
            },
            includedInNewsletters: [],
            viewCount: 0,
            likeCount: 0,
          });

        // 4. 원본 뉴스 상태 업데이트
        await newsDoc.ref.update({ status: 'processed' });

        results.push({
          newsId,
          articleId: articleRef.id,
          feynmanTitle: feynmanData.feynmanTitle,
        });
      } catch (error) {
        console.error(`Error generating for ${newsId}:`, error);
        errors.push({
          newsId,
          error: error.message || '생성 실패',
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      results,
      errors,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// CORS 설정
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

#### 작업 3: 관리자 대시보드 (`app/[locale]/admin/page.tsx`)

**요구사항**:
- 오늘 크롤링된 뉴스 목록 표시
- 체크박스로 다중 선택 (최대 10개)
- 필터: 카테고리, 국가, 소스
- "파인만 스타일로 변환" 버튼 → `/api/generate` 호출
- 로딩 상태 표시 (30-60초)

**구현 예시**:
```typescript
// app/[locale]/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RawNews } from '@/types/firestore';
import { getCategoryColor, getCountryFlag, timeAgo } from '@/lib/utils';

export default function AdminDashboard({ params: { locale } }) {
  const t = useTranslations('admin');

  const [news, setNews] = useState<RawNews[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState({
    category: 'all',
    country: 'all',
  });

  // 뉴스 로드
  useEffect(() => {
    loadTodayNews();
  }, [filter]);

  async function loadTodayNews() {
    const params = new URLSearchParams();
    if (filter.category !== 'all') params.append('category', filter.category);
    if (filter.country !== 'all') params.append('country', filter.country);

    const res = await fetch(`/api/news/today?${params}`);
    const data = await res.json();
    setNews(data.news || []);
  }

  // 선택 토글
  function toggleSelect(id: string) {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (newSelected.size >= 10) {
        alert('최대 10개까지 선택 가능합니다');
        return;
      }
      newSelected.add(id);
    }
    setSelected(newSelected);
  }

  // 파인만 생성
  async function handleGenerate() {
    if (selected.size === 0) {
      alert('뉴스를 선택해주세요');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsIds: Array.from(selected),
          language: locale,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`${data.results.length}개 기사 생성 완료!`);
        setSelected(new Set());
        // 편집기로 이동
        window.location.href = `/${locale}/admin/editor`;
      } else {
        alert(`생성 실패: ${data.errors.length}개`);
      }
    } catch (error) {
      alert('오류가 발생했습니다');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-primary">{news.length}</div>
          <div className="text-sm text-muted-foreground">{t('todayNews')}</div>
        </div>
        {/* 더 많은 통계 카드 */}
      </div>

      {/* 필터 */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="all">{t('categories.all')}</option>
          <option value="AI">{t('categories.ai')}</option>
          <option value="Education">{t('categories.education')}</option>
          <option value="AI+Education">{t('categories.aiEducation')}</option>
        </select>

        <select
          value={filter.country}
          onChange={(e) => setFilter({ ...filter, country: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="all">All Countries</option>
          <option value="KR">🇰🇷 Korea</option>
          <option value="US">🇺🇸 USA</option>
        </select>
      </div>

      {/* 뉴스 목록 */}
      <div className="space-y-4 mb-8">
        {news.map((item) => (
          <div
            key={item.id}
            className={`news-card ${selected.has(item.id) ? 'selected' : ''}`}
            onClick={() => toggleSelect(item.id)}
          >
            <div className="flex items-start gap-4">
              <Checkbox checked={selected.has(item.id)} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                  <span className="text-lg">{getCountryFlag(item.country)}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.source}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {timeAgo(item.publishedAt, locale)}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.content}
                </p>

                <div className="mt-2 flex gap-2">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-8 right-8 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border">
        <div className="text-sm mb-2">
          선택: {selected.size}개
        </div>
        <Button
          size="lg"
          disabled={selected.size === 0 || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              생성 중... ({selected.size}개)
            </>
          ) : (
            `🎓 파인만 스타일로 변환 (${selected.size}개)`
          )}
        </Button>
      </div>
    </div>
  );
}
```

---

### 5.2 우선순위 P1 (출시 후 1개월)

- [ ] Twitter API 연동
- [ ] 뉴스 검색 기능
- [ ] 조회수 추적
- [ ] RSS 피드

---

## 6. 구현 가이드

### 6.1 새 페이지 추가 가이드

#### Step 1: 파일 생성

```bash
# 예: 뉴스 상세 페이지
touch app/[locale]/posts/[slug]/page.tsx
```

#### Step 2: 기본 템플릿

```typescript
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function NewsDetailPage({
  params: { locale, slug },
}) {
  const t = await getTranslations('common');

  // Firestore에서 기사 조회
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 내용 */}
    </article>
  );
}

// SSG: 빌드 시 모든 slug 생성
export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map(a => ({ slug: a.slug }));
}
```

#### Step 3: 번역 추가

```json
// locales/ko/common.json
{
  "post": {
    "readMore": "더 읽기",
    "share": "공유하기"
  }
}
```

---

### 6.2 새 API 라우트 추가 가이드

#### Step 1: 파일 생성

```bash
mkdir -p app/api/your-endpoint
touch app/api/your-endpoint/route.ts
```

#### Step 2: 핸들러 구현

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 비즈니스 로직

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

### 6.3 Firebase Functions 구현 가이드

#### Step 1: Functions 폴더 초기화

```bash
cd functions
npm install
```

#### Step 2: `functions/src/index.ts` 작성

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { crawlAllNews } from '../../lib/crawlers';
import { sendWeeklyNewsletter } from './newsletter';

admin.initializeApp();

// 매일 오전 9시 크롤링
export const scheduledCrawl = functions
  .pubsub.schedule('0 9 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    console.log('Starting scheduled crawl...');

    const result = await crawlAllNews();

    console.log(`Crawled ${result.newNews} new articles`);
    return result;
  });

// 매주 일요일 오후 8시 뉴스레터
export const weeklyNewsletter = functions
  .pubsub.schedule('0 20 * * 0')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    console.log('Sending weekly newsletter...');

    await sendWeeklyNewsletter();

    return { success: true };
  });
```

#### Step 3: 배포

```bash
firebase deploy --only functions
```

---

## 7. 테스트 가이드

### 7.1 크롤러 테스트

```bash
# 로컬에서 크롤러 실행
node -e "
const { crawlAllNews } = require('./lib/crawlers/index.ts');
crawlAllNews().then(console.log);
"
```

**예상 결과**:
```json
{
  "success": true,
  "totalNews": 42,
  "newNews": 38,
  "errors": []
}
```

### 7.2 Grok API 테스트

```typescript
// test-grok.ts
import { generateFeynmanArticle } from './lib/grok-client';

const testNews = {
  id: '1',
  title: 'ChatGPT 교육 활용 가이드 발표',
  content: '...',
  source: 'TechCrunch',
  url: 'https://...',
  publishedAt: new Date().toISOString(),
  category: 'AI+Education' as const,
  country: 'US' as const,
};

generateFeynmanArticle(testNews, 'ko').then(result => {
  console.log('Title:', result.feynmanTitle);
  console.log('Questions:', result.questions);
});
```

**실행**:
```bash
npx tsx test-grok.ts
```

### 7.3 API 엔드포인트 테스트

```bash
# 크롤링 트리거
curl -X POST http://localhost:3000/api/crawl

# 파인만 생성
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"newsIds": ["abc123"], "language": "ko"}'
```

---

## 8. 배포 가이드

### 8.1 Vercel 배포 (프론트엔드)

#### Step 1: Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 연결
vercel
```

#### Step 2: 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `XAI_API_KEY`
- `RESEND_API_KEY`
- ... (모든 .env 변수)

#### Step 3: 배포

```bash
vercel --prod
```

#### Step 4: Cron 설정

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/crawl",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 8.2 Firebase 배포 (백엔드)

#### Step 1: Firebase 프로젝트 설정

```bash
firebase login
firebase use your-project-id
```

#### Step 2: Firestore Rules 배포

`firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feynman_articles/{article} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth.token.email == 'admin@example.com';
    }

    match /subscribers/{subscriber} {
      allow create: if true;
      allow read, update, delete: if request.auth.uid == subscriber;
    }

    match /{document=**} {
      allow read, write: if request.auth.token.email == 'admin@example.com';
    }
  }
}
```

배포:
```bash
firebase deploy --only firestore:rules
```

#### Step 3: Functions 배포

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 9. 트러블슈팅

### 9.1 일반적인 오류

#### 오류 1: `Firebase Admin SDK private key not found`

**원인**: `.env`에 `FIREBASE_ADMIN_PRIVATE_KEY` 누락

**해결**:
1. Firebase Console → Project Settings → Service Accounts
2. Generate New Private Key
3. JSON 파일 다운로드
4. `private_key` 값 복사 → `.env`에 입력 (따옴표 포함)

---

#### 오류 2: `Grok API 401 Unauthorized`

**원인**: 잘못된 `XAI_API_KEY`

**해결**:
1. https://x.ai/api 접속
2. API 키 재생성
3. `.env` 업데이트

---

#### 오류 3: `Module not found: Can't resolve '@/lib/utils'`

**원인**: TypeScript 경로 설정 문제

**해결**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 10. 참고 자료

### 10.1 공식 문서

| 기술 | 문서 링크 |
|------|----------|
| **Next.js** | https://nextjs.org/docs |
| **Firebase** | https://firebase.google.com/docs |
| **TailwindCSS** | https://tailwindcss.com/docs |
| **shadcn/ui** | https://ui.shadcn.com |
| **xAI Grok** | https://x.ai/docs (문의 필요) |
| **Resend** | https://resend.com/docs |

### 10.2 유용한 예제

- **파인만 기법 설명**: https://fs.blog/feynman-technique/
- **Next.js i18n**: https://next-intl-docs.vercel.app
- **Firestore 보안 규칙**: https://firebase.google.com/docs/rules
- **TipTap 에디터**: https://tiptap.dev/docs

---

## 📝 최종 체크리스트

다음 AI 또는 개발자가 이 프로젝트를 이어받을 때 확인할 사항:

- [ ] `.env` 파일 생성 및 모든 API 키 입력
- [ ] `npm install` 의존성 설치
- [ ] Firebase 프로젝트 연결 (`firebase use`)
- [ ] Firestore Rules 배포
- [ ] 로컬 개발 서버 실행 확인 (`npm run dev`)
- [ ] 크롤러 테스트 (`/api/crawl` 호출)
- [ ] Grok API 테스트 (테스트 뉴스 생성)
- [ ] Vercel 배포
- [ ] Firebase Functions 배포
- [ ] 프로덕션 테스트

---

**작성자 노트**:

이 프로젝트는 **핵심 인프라는 완성**되었지만, **UI와 API 라우트가 미완성** 상태입니다.

다음 작업자는:
1. **우선순위 P0 작업**부터 순서대로 구현하세요
2. **구현 가이드 섹션**의 예제 코드를 참고하세요
3. **트러블슈팅 섹션**을 자주 확인하세요
4. **테스트 가이드**로 각 기능을 검증하세요

모든 코드는 **TypeScript + Next.js 14 App Router + Firebase**로 작성되어 있으며,
**다국어(한국어/영어)** 지원을 위한 기반이 완비되어 있습니다.

**행운을 빕니다! 🚀**

---

**문의**: GitHub Issues 또는 reallygood83@github.com

---

**끝**
