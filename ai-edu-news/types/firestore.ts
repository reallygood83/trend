/**
 * Firestore 데이터 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

// 원본 뉴스 (크롤링된 데이터)
export interface RawNews {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Timestamp | string;
  crawledAt: Timestamp | string;

  // 분류
  category: 'AI' | 'Education' | 'AI+Education';
  country: 'KR' | 'US';

  // 처리 상태
  status: 'pending' | 'selected' | 'processed' | 'published';

  // 메타데이터
  keywords: string[];
}

// 파인만 스타일 기사 (생성된 콘텐츠)
export interface FeynmanArticle {
  id: string;
  rawNewsId: string; // 원본 뉴스 참조

  // 파인만 콘텐츠
  feynmanTitle: string;
  feynmanSummary: string;
  feynmanContent: string; // Markdown

  // 파인만 질문 3개
  questions: Array<{
    question: string;
    reasoning: string;
    type: 'principle' | 'application' | 'opposite';
  }>;

  // 메타데이터
  tags: string[];
  slug: string;
  metaDescription: string;
  targetAudience: 'teacher' | 'student' | 'parent';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  educationContext: string;

  // 타임스탬프
  createdAt: Timestamp | string;
  publishedAt: Timestamp | string | null;

  // 발행 상태
  status: 'draft' | 'published';
  platforms: {
    blog: { published: boolean; url: string };
    twitter?: { published: boolean; url: string };
    youtube?: { published: boolean; url: string };
  };

  // 뉴스레터
  includedInNewsletters: string[]; // newsletter IDs

  // 통계
  viewCount: number;
  likeCount: number;
}

// 뉴스레터
export interface Newsletter {
  id: string;
  title: string;
  articles: string[]; // FeynmanArticle IDs

  // 타임스탬프
  generatedAt: Timestamp | string;
  scheduledFor?: Timestamp | string;
  sentAt: Timestamp | string | null;

  // 상태
  status: 'draft' | 'scheduled' | 'sent';

  // 통계
  subscriberCount: number;
  openCount: number;
  clickCount: number;
  openRate: number;
  clickRate: number;
}

// 구독자
export interface Subscriber {
  id: string;
  email: string;
  name?: string;

  // 타임스탬프
  subscribedAt: Timestamp | string;
  unsubscribedAt?: Timestamp | string;

  // 상태
  status: 'active' | 'unsubscribed' | 'bounced';

  // 선호도
  preferences: {
    frequency: 'weekly' | 'biweekly';
    categories: Array<'AI' | 'Education' | 'AI+Education'>;
    language: 'ko' | 'en';
  };

  // 통계
  totalOpens: number;
  totalClicks: number;
  lastOpenedAt?: Timestamp | string;
}

// 크롤링 로그
export interface CrawlLog {
  id: string;
  source: string;
  crawledAt: Timestamp | string;
  success: boolean;
  newsCount: number;
  error?: string;
}

// Collection 이름 상수
export const COLLECTIONS = {
  RAW_NEWS: 'raw_news',
  FEYNMAN_ARTICLES: 'feynman_articles',
  NEWSLETTERS: 'newsletters',
  SUBSCRIBERS: 'subscribers',
  CRAWL_LOGS: 'crawl_logs',
} as const;
