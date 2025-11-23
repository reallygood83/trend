/**
 * 미국 AI/교육 뉴스 크롤러
 * RSS 및 API 사용
 */

import Parser from 'rss-parser';
import axios from 'axios';
import { RawNews } from '@/types/firestore';

const parser = new Parser();

// 미국 뉴스 소스
const USA_SOURCES = {
  AI: [
    {
      name: 'TechCrunch AI',
      type: 'rss' as const,
      url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    },
    {
      name: 'VentureBeat AI',
      type: 'rss' as const,
      url: 'https://venturebeat.com/category/ai/feed/',
    },
    {
      name: 'MIT Technology Review',
      type: 'rss' as const,
      url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    },
    {
      name: 'The Verge AI',
      type: 'rss' as const,
      url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    },
    {
      name: 'Ars Technica AI',
      type: 'rss' as const,
      url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
      filter: (title: string) => title.toLowerCase().includes('ai') || title.toLowerCase().includes('artificial intelligence'),
    },
  ],
  Education: [
    {
      name: 'EdSurge',
      type: 'rss' as const,
      url: 'https://www.edsurge.com/news.rss',
    },
    {
      name: 'eSchool News',
      type: 'rss' as const,
      url: 'https://www.eschoolnews.com/feed/',
    },
    {
      name: 'THE Journal',
      type: 'rss' as const,
      url: 'https://thejournal.com/rss-feeds/news.aspx',
    },
    {
      name: 'EdTech Magazine',
      type: 'rss' as const,
      url: 'https://edtechmagazine.com/higher/rss.xml',
    },
  ],
};

/**
 * 미국 뉴스 크롤링
 */
export async function crawlUSANews(): Promise<RawNews[]> {
  const allArticles: RawNews[] = [];

  // AI 뉴스
  for (const source of USA_SOURCES.AI) {
    try {
      const articles = await crawlRSS(source, 'AI', 'US');
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Failed to crawl ${source.name}:`, error);
    }
  }

  // 교육 뉴스
  for (const source of USA_SOURCES.Education) {
    try {
      const articles = await crawlRSS(source, 'Education', 'US');
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Failed to crawl ${source.name}:`, error);
    }
  }

  return allArticles;
}

/**
 * RSS 파싱
 */
async function crawlRSS(
  source: any,
  category: 'AI' | 'Education',
  country: 'KR' | 'US'
): Promise<RawNews[]> {
  const feed = await parser.parseURL(source.url);

  const articles: RawNews[] = [];

  for (const item of feed.items.slice(0, 20)) {
    // 최근 20개만
    // 필터 적용 (있는 경우)
    if (source.filter && !source.filter(item.title || '')) {
      continue;
    }

    // AI+교육 키워드 체크
    const finalCategory = categorizeNews(item.title || '', item.contentSnippet || '', category);

    articles.push({
      id: generateId(item.link || ''),
      title: item.title || '',
      content: (item.contentSnippet || item.content || '').substring(0, 500),
      source: source.name,
      url: item.link || '',
      publishedAt: item.pubDate || new Date().toISOString(),
      crawledAt: new Date().toISOString(),
      category: finalCategory,
      country: country,
      status: 'pending',
      keywords: extractKeywords(item.title || ''),
    });
  }

  return articles;
}

/**
 * 카테고리 자동 분류
 */
function categorizeNews(
  title: string,
  content: string,
  defaultCategory: 'AI' | 'Education'
): 'AI' | 'Education' | 'AI+Education' {
  const text = (title + ' ' + content).toLowerCase();

  const aiKeywords = ['ai', 'artificial intelligence', 'gpt', 'chatbot', 'machine learning', 'deep learning', 'llm', 'generative'];
  const eduKeywords = ['education', 'school', 'student', 'teacher', 'classroom', 'learning', 'university', 'edtech'];

  const hasAI = aiKeywords.some((kw) => text.includes(kw));
  const hasEdu = eduKeywords.some((kw) => text.includes(kw));

  if (hasAI && hasEdu) {
    return 'AI+Education';
  } else if (hasAI) {
    return 'AI';
  } else if (hasEdu) {
    return 'Education';
  }

  return defaultCategory;
}

/**
 * 키워드 추출 (영어)
 */
function extractKeywords(title: string): string[] {
  const keywords = [
    'AI',
    'ChatGPT',
    'GPT',
    'Claude',
    'Gemini',
    'OpenAI',
    'Anthropic',
    'Google',
    'Microsoft',
    'education',
    'school',
    'student',
    'teacher',
    'learning',
    'edtech',
  ];

  const titleLower = title.toLowerCase();
  return keywords.filter((kw) => titleLower.includes(kw.toLowerCase()));
}

/**
 * ID 생성 (URL 기반)
 */
function generateId(url: string): string {
  const hash = Buffer.from(url).toString('base64').substring(0, 16);
  return hash.replace(/[^a-zA-Z0-9]/g, '');
}
